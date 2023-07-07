import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { Status } from "../constants/status";
import { Role } from "../constants/role";

export interface UserData {
  fcmToken: string;
  firstName: string;
  lastName: string;
  brigades: {
    [brigadeId: string]: {
      status: Status;
      time: string;
      roles: Role[];
    };
  };
  location: FirebaseFirestoreTypes.GeoPoint;
  updated: FirebaseFirestoreTypes.Timestamp;
}
