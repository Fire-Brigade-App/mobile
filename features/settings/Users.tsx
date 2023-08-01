import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { Status } from "../../constants/status";
import firestore from "@react-native-firebase/firestore";
import { UserData, UserDataWithUid } from "../../data/UserData";
import { useAuth } from "../authentication/auth";
import { Link } from "expo-router";
import { colors } from "../../styles/colors";

const UserItem: FC<{ userData: UserDataWithUid }> = ({ userData }) => {
  return (
    <View style={styles.user}>
      <Link
        href={{
          pathname: "settings/management/users/[id]",
          params: { id: userData.uid },
        }}
        asChild
      >
        <Text style={styles.name}>
          {userData.lastName} {userData.firstName}
        </Text>
      </Link>
    </View>
  );
};

const Users: FC = () => {
  const { brigadeId } = useAuth();
  const [users, setUsers] = useState<UserDataWithUid[]>([]);

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
        const users = documentSnapshot.docs
          .map((doc) => ({
            uid: doc.id,
            ...(doc.data() as UserData),
          }))
          .sort((a, b) => a.lastName.localeCompare(b.lastName));
        setUsers(users);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [brigadeId]);

  return (
    <View style={styles.content}>
      {Boolean(users.length) ? (
        <FlatList
          data={users}
          renderItem={({ item }) => <UserItem userData={item} />}
        />
      ) : (
        <View style={styles.full}>
          <Text style={styles.nodata}>no new candidates</Text>
        </View>
      )}
    </View>
  );
};

export default Users;

const styles = StyleSheet.create({
  content: {
    width: "100%",
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 8,
  },
  user: {
    marginHorizontal: 20,
    marginVertical: 8,
    borderColor: "#dddddd",
    borderTopColor: colors.blue,
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: "#ffffff",
    padding: 15,
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
