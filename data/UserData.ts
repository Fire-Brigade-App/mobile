import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { Status } from "../constants/status";
import { Role } from "../constants/role";
import { Activity } from "../constants/Activity";

export interface UserData {
  activity: Activity;
  brigades: {
    [brigadeId: string]: {
      status: Status;
      time: string;
      roles: Role[];
    };
  };
  fcmToken: string;
  firstName: string;
  lastName: string;
  location: FirebaseFirestoreTypes.GeoPoint;
  updated: FirebaseFirestoreTypes.Timestamp;
}

export interface UserDataWithUid extends UserData {
  uid: string;
}
