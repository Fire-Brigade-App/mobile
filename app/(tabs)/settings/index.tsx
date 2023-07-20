import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { SignOut } from "../../../features/authentication/SignOut";
import { Link, Stack } from "expo-router";
import { Screen } from "../../../features/screen/Screen";
import { useAdmin } from "../../../features/authentication/auth";

const Settings: FC = () => {
  const { isAdmin } = useAdmin();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Settings",
        }}
      />
      <Screen>
        <View style={styles.top}>
          <SignOut />
        </View>
        <View style={styles.content}>
          <Link href="/settings/user-name" style={styles.link}>
            Your profile
          </Link>
          <Link href="/settings/user-brigade" style={styles.link}>
            Your fire brigade
          </Link>
          {isAdmin && (
            <Link href="/settings/management" style={styles.link}>
              Management
            </Link>
          )}
          <Link href="/settings/application" style={styles.link}>
            Application
          </Link>
        </View>
      </Screen>
    </>
  );
};

export default Settings;

const styles = StyleSheet.create({
  top: {
    width: "100%",
  },
  content: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  link: {
    fontSize: 24,
    color: "#2196F3",
    fontWeight: "300",
    paddingVertical: 10,
  },
});
