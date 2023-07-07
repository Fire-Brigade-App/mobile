import React from "react";
import { StyleSheet, View } from "react-native";
import { SignOut } from "../../../features/authentication/SignOut";
import { Link } from "expo-router";
import { SafeAreaScreen } from "../../../features/screen/SafeAreaScreen";

const Settings = () => {
  return (
    <SafeAreaScreen>
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
      </View>
    </SafeAreaScreen>
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
