import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { FC, useEffect, useState } from "react";
import { Status } from "../../constants/status";
import firestore from "@react-native-firebase/firestore";
import { UserData, UserDataWithUid } from "../../data/UserData";
import { useAuth } from "../authentication/auth";
import { titleStyle } from "../../styles/title";
import { contentStyle } from "../../styles/content";

const Candidate: FC<{
  userData: UserDataWithUid;
  changeStatus: (userUid: string, status: Status) => Promise<void>;
}> = ({ userData, changeStatus }) => {
  const [loading, setLoading] = useState(false);

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
            <Pressable onPress={() => handleChangeStatus(Status.OFFLINE)}>
              <Text style={[styles.button, styles.approve]}>Approve</Text>
            </Pressable>
            <Pressable onPress={() => handleChangeStatus(Status.SUSPENDED)}>
              <Text style={[styles.button, styles.decline]}>Decline</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

const Candidates: FC = () => {
  const { brigadeId } = useAuth();
  const [candidates, setCandidates] = useState<UserDataWithUid[]>([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection("users")
      .where(`brigades.${brigadeId}.status`, "in", [Status.CANDIDATE])
      .onSnapshot((documentSnapshot) => {
        const users = documentSnapshot.docs.map((doc) => ({
          uid: doc.id,
          ...(doc.data() as UserData),
        }));
        setCandidates(users);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [brigadeId]);

  const handleChangeStatus = async (userUid: string, status: Status) => {
    await firestore()
      .collection("users")
      .doc(userUid)
      .update({ [`brigades.${brigadeId}.status`]: status })
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
