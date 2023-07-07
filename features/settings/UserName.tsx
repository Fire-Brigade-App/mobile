import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { FC, useState } from "react";
import { useAuth } from "../authentication/auth";
import { inputStyle } from "../../styles/input";
import { titleStyle } from "../../styles/title";
import firestore from "@react-native-firebase/firestore";
import { useFcmToken } from "../../utils/notifications";
import TextButton from "../../components/TextButton";
import { Link } from "expo-router";
import { SafeAreaScreen } from "../screen/SafeAreaScreen";

interface UserDataToSave {
  userUid: string;
  fcmToken: string;
  firstName: string;
  lastName: string;
}

const saveUserName = async (data: UserDataToSave) => {
  const { userUid, fcmToken, firstName, lastName } = data;

  const userData = {
    fcmToken,
    firstName,
    lastName,
    location: new firestore.GeoPoint(0, 0),
    updated: firestore.Timestamp.fromDate(new Date()),
  };

  const user = firestore().collection("users").doc(userUid);
  const isUserExists = (await user.get()).exists;

  if (isUserExists) {
    await user.update(userData);
  } else {
    await user.set(userData);
  }
};

const UserName: FC<{ isInitial?: boolean }> = ({ isInitial = false }) => {
  const { user, userData } = useAuth();
  const { fcmToken } = useFcmToken();
  const [firstName, setFirstName] = useState(userData?.firstName ?? "");
  const [lastName, setLastName] = useState(userData?.lastName ?? "");
  const [loading, setLoading] = useState(false);
  const isFormValid = firstName && lastName;

  // this component could be shown in the initial state just before signing in
  // if the user data is not existing
  const saveButton = isInitial ? "Save" : "Next";
  const isFormChanged =
    userData?.firstName !== firstName || userData?.lastName !== lastName;

  const handleSave = async () => {
    setLoading(true);
    await saveUserName({ firstName, lastName, fcmToken, userUid: user.uid });
    setLoading(false);
  };

  return (
    <SafeAreaScreen>
      {!isInitial && (
        <View style={styles.top}>
          <Link href="/settings" asChild>
            <TextButton title={"Back"} align="left" />
          </Link>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title}>Your name</Text>
        <TextInput
          style={styles.input}
          placeholder="first name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="last name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextButton
          loading={loading}
          title={saveButton}
          disabled={!isFormValid || !isFormChanged}
          onPress={handleSave}
        />
      </View>
    </SafeAreaScreen>
  );
};

export default UserName;

const styles = StyleSheet.create({
  top: {
    width: "100%",
  },
  back: {
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: inputStyle,
  title: titleStyle,
});
