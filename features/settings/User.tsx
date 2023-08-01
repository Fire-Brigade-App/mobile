import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import React, { FC, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "../authentication/auth";
import { UserData } from "../../data/UserData";
import { contentStyle } from "../../styles/content";
import { formatDistance } from "date-fns";
import { titleStyle } from "../../styles/title";
import { Role } from "../../constants/Role";
import { useBrigade } from "../status/useBrigade";
import { BrigadePermissions } from "../../constants/BrigadePermissions";
import { Status } from "../../constants/Status";

const User: FC<{ userUid: string }> = ({ userUid }) => {
  const { brigadeId, user } = useAuth();
  const [userData, setUserData] = useState<UserData>(null);
  const { brigade } = useBrigade();
  const isThisYou = user.uid === userUid;

  const updated = userData
    ? formatDistance(userData.updated.toDate(), new Date(), {
        addSuffix: true,
      })
    : "";

  useEffect(() => {
    const subscriber = firestore()
      .collection("users")
      .doc(userUid)
      .onSnapshot((documentSnapshot) => {
        const user = documentSnapshot.data() as UserData;
        setUserData(user);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [userUid, brigadeId]);

  // Currently there are only two values are possible: undefined or ["admin"];
  const permissions = brigade && brigade.permissions[userUid];
  const togglePermissions = async (): Promise<void> => {
    let permissionsToSet = brigade ? { ...brigade?.permissions } : {};
    if (permissions) {
      delete permissionsToSet[userUid];
    } else {
      permissionsToSet = {
        ...permissionsToSet,
        [userUid]: [BrigadePermissions.ADMIN],
      };
    }

    await firestore()
      .collection("brigades")
      .doc(brigadeId)
      .update({
        permissions: permissionsToSet,
      })
      .then(() => {
        console.log("User updated!");
      });
  };

  const roles = userData?.brigades[brigadeId]?.roles ?? [];
  const toggleRole = async (role: Role): Promise<void> => {
    let rolesToSet = [...roles];
    const isRole = roles.includes(role);
    if (isRole) {
      rolesToSet = rolesToSet.filter((r) => r !== role);
    } else {
      rolesToSet = [...rolesToSet, role];
    }

    await firestore()
      .collection("users")
      .doc(userUid)
      .update({
        [`brigades.${brigadeId}.roles`]: rolesToSet,
      })
      .then(() => {
        console.log("User updated!");
      });
  };

  const router = useRouter();
  const handleSuspend = async (): Promise<void> => {
    await firestore()
      .collection("users")
      .doc(userUid)
      .update({ [`brigades.${brigadeId}.status`]: Status.SUSPENDED })
      .then(() => {
        console.log("User suspended!");
      });

    // Suspended users list is visible on Candidates page
    router.push("/settings/management/candidates");
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: userData
            ? `${userData.firstName} ${userData.lastName}`
            : "",
        }}
      />
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.title}>UID</Text>
          <Text>{userUid}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Last status update</Text>
          <Text>{updated}</Text>
        </View>
        {!isThisYou && (
          <View style={styles.section}>
            <Text style={styles.title}>Permissions</Text>
            <View style={styles.row}>
              <Text>Admin</Text>
              <Switch
                onValueChange={togglePermissions}
                value={
                  permissions
                    ? permissions.includes(BrigadePermissions.ADMIN)
                    : false
                }
              />
            </View>
          </View>
        )}
        <View style={styles.section}>
          <Text style={styles.title}>Roles</Text>
          <View style={styles.row}>
            <Text>Firefighter </Text>
            <Switch
              onValueChange={() => toggleRole(Role.FIREFIGHTER)}
              value={roles.includes(Role.FIREFIGHTER)}
            />
          </View>
          <View style={styles.row}>
            <Text>Commander </Text>
            <Switch
              onValueChange={() => toggleRole(Role.COMMANDER)}
              value={roles.includes(Role.COMMANDER)}
            />
          </View>
          <View style={styles.row}>
            <Text>Driver </Text>
            <Switch
              onValueChange={() => toggleRole(Role.DRIVER)}
              value={roles.includes(Role.DRIVER)}
            />
          </View>
          <View style={styles.row}>
            <Text>Paramedic </Text>
            <Switch
              onValueChange={() => toggleRole(Role.PARAMEDIC)}
              value={roles.includes(Role.PARAMEDIC)}
            />
          </View>
        </View>
        {!isThisYou && (
          <View style={styles.section}>
            <Text style={styles.title}>Status</Text>
            <View style={styles.suspend}>
              <Pressable onPress={handleSuspend}>
                <Text style={styles.suspendText}>Suspend user</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </>
  );
};

export default User;

const styles = StyleSheet.create({
  content: contentStyle,
  section: {
    marginBottom: 20,
  },
  title: { ...titleStyle, marginBottom: 0 },
  row: {
    flexDirection: "row",
    paddingVertical: 5,
  },
  suspend: {
    flexDirection: "row",
  },
  suspendText: {
    fontWeight: "bold",
    color: "#DC143C",
    borderColor: "#DC143C",
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
  },
});
