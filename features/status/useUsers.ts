import { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { Status } from "./UserStatus";
import { User } from "../../app/(auth)/user-data-form";

const orderedStatuses = [
  Status.NEAR,
  Status.FAR,
  Status.OUT,
  Status.BUSY,
  Status.OFFLINE,
  Status.INACTIVE,
];

const getStatusIndex = (user: User, brigadeId: string) => {
  return orderedStatuses.indexOf(user.brigades[brigadeId].status);
};

const getTime = (user: User, brigadeId: string) => {
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
        const users = documentSnapshot.docs.map((doc) => doc.data() as User);
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
