import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Screen } from "../screen/Screen";
import { GoogleSigninButton } from "./GoogleSignin";
// import { SignInWithEmailAndPassword } from "./SignInWithEmailAndPassword";
import { SignInWithEmailLink } from "./SignInWithEmailLink";
import { EmailLinkHandler } from "./EmailLinkHandler";

export const Login: FC = () => {
  return (
    <Screen>
      <View style={styles.form}>
        <View>
          {/* <SignInWithEmailAndPassword /> */}
          <SignInWithEmailLink />
        </View>
        <View style={styles.separator}></View>
        <View style={styles.google}>
          <GoogleSigninButton />
        </View>
        <EmailLinkHandler />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  form: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    padding: 30,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
    width: "100%",
    height: 30,
    // backgroundColor: "red",
  },
  google: {
    alignItems: "center",
    marginTop: 25,
  },
});
