import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { FC, useEffect, useState } from "react";
import { Status } from "../../constants/Status";
import firestore from "@react-native-firebase/firestore";
import { UserData, UserDataWithUid } from "../../data/UserData";
import { useAuth } from "../authentication/auth";
import { titleStyle } from "../../styles/title";
import { contentStyle } from "../../styles/content";
import { Activity } from "../../constants/Activity";

const Candidate: FC<{
  userData: UserDataWithUid;
  changeStatus: (userUid: string, status: Status) => Promise<void>;
}> = ({ userData, changeStatus }) => {
  const [loading, setLoading] = useState(false);
  const { brigadeId } = useAuth();
  const isSuspended =
    userData?.brigades[brigadeId]?.status === Status.SUSPENDED;

  const handleChangeStatus = async (status: Status) => {
    setLoading(true);
    await changeStatus(userData.uid, status);
    setLoading(false);
  };

  return (
    <View style={styles.candidate}>
      <Text style={styles.name}>
        {userData.firstName} {userData.lastName}
      </Text>
      <View style={styles.buttons}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
            <Pressable onPress={() => handleChangeStatus(Status.EMPTY)}>
              <Text style={[styles.button, styles.approve]}>Approve</Text>
            </Pressable>
            {!isSuspended && (
              <Pressable onPress={() => handleChangeStatus(Status.SUSPENDED)}>
                <Text style={[styles.button, styles.decline]}>Decline</Text>
              </Pressable>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const Candidates: FC = () => {
  const { brigadeId } = useAuth();
  const [candidates, setCandidates] = useState<UserDataWithUid[]>([]);
  const [suspended, setSuspended] = useState<UserDataWithUid[]>([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection("users")
      .where(`brigades.${brigadeId}.status`, "in", [
        Status.CANDIDATE,
        Status.SUSPENDED,
      ])
      .onSnapshot((documentSnapshot) => {
        const users = documentSnapshot.docs.map((doc) => ({
          uid: doc.id,
          ...(doc.data() as UserData),
        }));

        const candidatesUsers = users.filter(
          (user) => user.brigades[brigadeId].status === Status.CANDIDATE
        );
        const suspendedUsers = users.filter(
          (user) => user.brigades[brigadeId].status === Status.SUSPENDED
        );
        setCandidates(candidatesUsers);
        setSuspended(suspendedUsers);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [brigadeId]);

  const handleChangeStatus = async (userUid: string, status: Status) => {
    await firestore()
      .collection("users")
      .doc(userUid)
      .update({
        activity: Activity.INACTIVE,
        [`brigades.${brigadeId}.status`]: status,
      })
      .then(() => {
        console.log("User status changed!");
      });
  };

  return (
    <View style={styles.content}>
      <Text>This is a list of users who wants to join your fire brigade:</Text>
      {Boolean(candidates.length) ? (
        <FlatList
          data={candidates}
          renderItem={({ item }) => (
            <Candidate userData={item} changeStatus={handleChangeStatus} />
          )}
        />
      ) : (
        <View style={styles.full}>
          <Text style={styles.nodata}>no new candidates</Text>
        </View>
      )}

      <Text style={styles.title}>Suspended users</Text>
      {Boolean(suspended.length) ? (
        <FlatList
          data={suspended}
          renderItem={({ item }) => (
            <Candidate userData={item} changeStatus={handleChangeStatus} />
          )}
        />
      ) : (
        <View style={styles.full}>
          <Text style={styles.nodata}>no suspended users</Text>
        </View>
      )}
    </View>
  );
};

export default Candidates;

const styles = StyleSheet.create({
  content: contentStyle,
  title: titleStyle,
  candidate: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#eeeeee",
    borderWidth: 2,
    borderRadius: 15,
    marginTop: 10,
    paddingHorizontal: 5,
  },
  name: {
    marginLeft: 8,
  },
  buttons: {
    flexDirection: "row",
  },
  button: {
    fontWeight: "700",
    padding: 8,
  },
  approve: {
    color: "#3CB371",
  },
  decline: {
    color: "#DC143C",
  },
  nodata: {
    color: "#CCCCCC",
    fontSize: 20,
    textAlign: "center",
  },
  full: {
    flex: 1,
    justifyContent: "center",
  },
});
