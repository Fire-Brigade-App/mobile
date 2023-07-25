import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { getData, storeData } from "./asyncStorage";
import { LocalStorage } from "../constants/localStorage";
import { put } from "../api/api";

const LOCATION_TASK_NAME = "background-location-task";

export interface LocationObject extends Location.LocationObject {
  source:
    | "background-location-task"
    | "background-fetch"
    | "trigger-location-update";
}

export const defineLocationTask = async () => {
  TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      const { locations } = data as { locations: Location.LocationObject };
      const location = {
        ...locations[0],
        source: LOCATION_TASK_NAME,
      };
      await updateLocation(location);
    }
  });
};

export const startLocationUpdates = async () => {
  const { status: foregroundStatus } =
    await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus === "granted") {
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus === "granted") {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
      });
    }
  }
};

export const hasStartedLocationUpdates = async () => {
  return Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
};

export const stopLocationUpdates = async () => {
  if (await hasStartedLocationUpdates()) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }
};

export const getLocation = async () => {
  let location: Location.LocationObject;
  try {
    location = await Location.getCurrentPositionAsync();
  } catch (err) {
    location = await Location.getLastKnownPositionAsync();
  }
  return location;
};

export const triggerLocationUpdate = async () => {
  const location = await getLocation();
  await updateLocation({ ...location, source: "trigger-location-update" });
};

export default async function updateLocation(location: LocationObject) {
  // Check if another location update is active
  const isActive = await getData(LocalStorage.IS_LOCATION_UPDATE_ACTIVE);
  if (isActive === "true") {
    return;
  }

  let preventRouteDurationMeasurement = false;

  // Check if previos user location is not too similar to current location.
  // If yes, don't update location on the server, but only sent blank values
  // for updating timestamp of the last user activity.
  const previousLocation = await getData(LocalStorage.USER_LOCATION);
  if (previousLocation) {
    const previousLocationJson = JSON.parse(previousLocation);
    const { latitude, longitude } = location.coords;
    const { latitude: prevLatitude, longitude: prevLongitude } =
      previousLocationJson.coords;
    const isSimilarCoordinates = isSignificantCoordinatesDiff(
      [prevLatitude, prevLongitude],
      [latitude, longitude]
    );
    preventRouteDurationMeasurement = !isSimilarCoordinates;
  }

  if (!preventRouteDurationMeasurement) {
    await storeData(LocalStorage.USER_LOCATION, JSON.stringify(location));
  }

  // Prevent another potential location updates
  await storeData(LocalStorage.IS_LOCATION_UPDATE_ACTIVE, "true");
  const brigadesIdsFromStorage = await getData(LocalStorage.BRIGADES_IDS);
  const brigadesIds = JSON.parse(brigadesIdsFromStorage);
  const userUid = await getData(LocalStorage.USER_UID);

  const locationData = {
    ...location,
    brigadesIds,
    preventRouteDurationMeasurement,
  };

  try {
    await put(`/location/${userUid}`, locationData);
  } catch (error) {
    console.error(error);
  }

  // Unblock another potential location updates
  await storeData(LocalStorage.IS_LOCATION_UPDATE_ACTIVE, "false");
}

export const isSignificantCoordinatesDiff = (
  coordinatesA: [number, number],
  coordinatesB: [number, number]
) => {
  const [latA, lonA] = coordinatesA;
  const [latB, lonB] = coordinatesB;

  // We only need to return true if between locations is distance bigger than
  // ~25  meters
  const isLatDiff = Math.abs(latA - latB) > 0.0003;
  const isLonDiff = Math.abs(lonA - lonB) > 0.0002;

  return isLatDiff || isLonDiff;
};
