import { getData, storeData } from "../utils/asyncStorage";
import { post } from "./api";

export default async function updateLocation(location) {
  console.log("Init the location updating:", JSON.stringify(location));

  const IS_ACTIVE = "is-location-update-active";

  // Check if another location update is active
  const isActive = await getData(IS_ACTIVE);
  if (isActive === "true") {
    return;
  }
  
  // Prevent another potential location updates
  await storeData(IS_ACTIVE, "true");

  // await post("/", location);

  // Unblock another potential location updates
  await storeData(IS_ACTIVE, "false");
}
