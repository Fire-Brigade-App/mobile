import { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { UserDataWithUid } from "../../data/UserData";
import { Status } from "../../constants/Status";
import { Activity } from "../../constants/Activity";
import { useAlerts } from "../alerts/userAlerts";
import { AlertWithId } from "../alerts/Alerts";
import { UserStatusInAlert } from "../../constants/UserStatusInAlarm";

const orderedStatuses = [Status.NEAR, Status.FAR, Status.OUT, Status.EMPTY];

const getStatusIndex = (user: UserDataWithUid, brigadeId: string) => {
  return orderedStatuses.indexOf(user.brigades[brigadeId].status);
};

const orderedActivity = [
  Activity.ONLINE,
  Activity.BUSY,
  Activity.OFFLINE,
  Activity.INACTIVE,
];

const getActivityIndex = (user: UserDataWithUid) => {
  return orderedActivity.indexOf(user.activity);
};

const getTime = (user: UserDataWithUid, brigadeId: string) => {
  return parseInt(
    user.brigades[brigadeId].time
      .split(":")
      .map((d) => d.toString().padStart(2, "0"))
      .join("")
  );
};

const orderedStatusInAlert = [
  UserStatusInAlert.CONFIRM,
  UserStatusInAlert.ON_THE_WAY,
  UserStatusInAlert.REJECT,
  undefined,
];

const getStatusInAlert = (user: UserDataWithUid, currentAlert: AlertWithId) => {
  return orderedStatusInAlert.indexOf(currentAlert.users[user.uid]);
};

export const useUsers = (brigadeId: string) => {
  const [users, setUsers] = useState<UserDataWithUid[]>([]);
  const { currentAlert } = useAlerts();

  useEffect(() => {
    const subscriber = firestore()
      .collection("users")
      .where(`brigades.${brigadeId}.status`, "in", [
        Status.NEAR,
        Status.FAR,
        Status.OUT,
        Status.EMPTY,
      ])
      .onSnapshot((documentSnapshot) => {
        const users = documentSnapshot.docs.map(
          (doc) => ({ uid: doc.id, ...doc.data() } as UserDataWithUid)
        );
        let sortedUsers = [];
        if (currentAlert) {
          sortedUsers = users.sort(
            (a, b) =>
              getStatusInAlert(a, currentAlert) -
                getStatusInAlert(b, currentAlert) ||
              getActivityIndex(a) - getActivityIndex(b) ||
              getStatusIndex(a, brigadeId) - getStatusIndex(b, brigadeId) ||
              getTime(a, brigadeId) - getTime(b, brigadeId)
          );
        } else {
          sortedUsers = users.sort(
            (a, b) =>
              getActivityIndex(a) - getActivityIndex(b) ||
              getStatusIndex(a, brigadeId) - getStatusIndex(b, brigadeId) ||
              getTime(a, brigadeId) - getTime(b, brigadeId)
          );
        }
        setUsers(sortedUsers);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [brigadeId, currentAlert]);

  return { users };
};
