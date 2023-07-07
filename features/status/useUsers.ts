import { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { UserData } from "../../data/UserData";
import { Status } from "../../constants/status";

const orderedStatuses = [
  Status.NEAR,
  Status.FAR,
  Status.OUT,
  Status.BUSY,
  Status.OFFLINE,
  Status.INACTIVE,
];

const getStatusIndex = (user: UserData, brigadeId: string) => {
  return orderedStatuses.indexOf(user.brigades[brigadeId].status);
};

const getTime = (user: UserData, brigadeId: string) => {
  return parseInt(
    user.brigades[brigadeId].time
      .split(":")
      .map((d) => d.toString().padStart(2, "0"))
      .join("")
  );
};

export const useUsers = (brigadeId: string) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection("users")
      .where(`brigades.${brigadeId}`, "!=", "undefined")
      .onSnapshot((documentSnapshot) => {
        const users = documentSnapshot.docs.map(
          (doc) => doc.data() as UserData
        );
        const sortedUsers = users.sort(
          (a, b) =>
            getStatusIndex(a, brigadeId) - getStatusIndex(b, brigadeId) ||
            getTime(a, brigadeId) - getTime(b, brigadeId)
        );
        setUsers(sortedUsers);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [brigadeId]);

  return { users };
};
