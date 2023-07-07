import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { BrigadeStatus } from "../constants/brigadeStatus";
import { BrigadePermissions } from "../constants/brigadePermissions";

export interface Brigade {
  name: string;
  country: string;
  province: string;
  municipality: string;
  location: FirebaseFirestoreTypes.GeoPoint;
  permissions: { [userUid: string]: BrigadePermissions[] };
  status: BrigadeStatus;
  alerts: string[];
}
