import React, { FC, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PACKAGE_NAME = process.env.PACKAGE_NAME;
const DYNAMIC_LINK = `${process.env.DYNAMIC_LINK_SCHEME}://${process.env.DYNAMIC_LINK_DOMAIN}`;
// const URL = `fire-brigade://sign-in`;

export const SignInWithEmailLink: FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sendSignInLink = async (email: string) => {
    setError("");
    setLoading(true);

    const actionCodeSettings = {
      handleCodeInApp: true,
      // URL must be whitelisted in the Firebase Console.
      url: DYNAMIC_LINK,
      iOS: {
        bundleId: PACKAGE_NAME,
      },
      android: {
        packageName: PACKAGE_NAME,
        installApp: false,
        minimumVersion: "12",
      },
    };

    // Save the email for latter usage
    await AsyncStorage.setItem("emailForSignIn", email);

    try {
      await auth().sendSignInLinkToEmail(email, actionCodeSettings);

      setSuccess(
        "Login link sent to your email. Please click the link to activate your account"
      );
      /* You can also show a prompt to open the user's mailbox using 'react-native-email-link'
       * await openInbox({ title: `Login link sent to ${email}`, message: 'Open my mailbox' }); */
    } catch (error) {
      console.log(error);
      setError(`Error code: ${error.code}`);
    }

    setLoading(false);
  };

  return (
    <View>
      {success ? (
        <>
          <Text style={styles.success}>{success}</Text>
          <Text style={styles.tryAgain} onPress={() => setSuccess("")}>
            or try again
          </Text>
        </>
      ) : (
        <>
          {Boolean(error) && <Text style={styles.error}>{error}</Text>}
          <TextInput
            style={styles.input}
            placeholder="email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <Button
              disabled={!email}
              title="Login"
              onPress={() => sendSignInLink(email)}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    padding: 10,
    marginBottom: 15,
  },
  success: {
    padding: 20,
    borderColor: "mediumseagreen",
    borderWidth: 1,
    color: "mediumseagreen",
    backgroundColor: "mintcream",
    borderRadius: 20,
    marginBottom: 15,
  },
  tryAgain: {
    color: "grey",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  error: {
    color: "red",
  },
});
