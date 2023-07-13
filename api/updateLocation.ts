import { LocalStorage } from "../constants/localStorage";
import { getData, storeData } from "../utils/asyncStorage";
import { LocationObject } from "../utils/location";
import { put } from "./api";

export default async function updateLocation(location: LocationObject) {
  console.log("Init the location updating:", JSON.stringify(location));

  // Check if another location update is active
  const isActive = await getData(LocalStorage.IS_LOCATION_UPDATE_ACTIVE);
  if (isActive === "true") {
    return;
  }

  // Prevent another potential location updates
  await storeData(LocalStorage.IS_LOCATION_UPDATE_ACTIVE, "true");
  const brigadesIdsFromStorage = await getData(LocalStorage.BRIGADES_IDS);
  const brigadesIds = JSON.parse(brigadesIdsFromStorage);
  const userUid = await getData(LocalStorage.USER_UID);

  const locationData = { ...location, brigadesIds };

  await put(`/location/${userUid}`, locationData);

  // Unblock another potential location updates
  await storeData(LocalStorage.IS_LOCATION_UPDATE_ACTIVE, "false");
}
