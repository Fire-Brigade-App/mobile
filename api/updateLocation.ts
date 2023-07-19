import { LocalStorage } from "../constants/localStorage";
import { getData, storeData } from "../utils/asyncStorage";
import {
  LocationObject,
  isSignificantCoordinatesDiff,
} from "../utils/location";
import { put } from "./api";

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
