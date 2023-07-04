import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Screen } from "../../features/screen/Screen";
import { useAuth } from "../../features/authentication/auth";
import { SignOut } from "../../features/authentication/SignOut";

const Settings = () => {
  const { user, userData } = useAuth();

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Account</Text>
        <Text>Email: {user.email}</Text>
        <Text>
          Name: {userData.firstName} {userData.lastName}
        </Text>
        <Text>Brigades: {JSON.stringify(userData.brigades)}</Text>
        <SignOut />
      </View>
    </Screen>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
  },
  label: {
    color: "#777777",
  },
});
