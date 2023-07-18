import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import updateLocation from "../api/updateLocation";

const LOCATION_TASK_NAME = "background-location-task";

export interface LocationObject extends Location.LocationObject {
  source: "background-location-task" | "background-fetch";
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

export const isSignificantCoordinatesDiff = (
  coordinatesA: [number, number],
  coordinatesB: [number, number]
) => {
  const [latA, lonA] = coordinatesA;
  const [latB, lonB] = coordinatesB;

  // We only need to return true if between locations is distance bigger than
  // ~25  meters
  const idLatDiff = Math.abs(latA - latB) > 0.0003;
  const isLonDiff = Math.abs(lonA - lonB) > 0.0002;

  return idLatDiff || isLonDiff;
};
