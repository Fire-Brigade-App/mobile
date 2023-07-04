import React, { FC } from "react";
import {
  GoogleSignin,
  GoogleSigninButton as RNGoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";

GoogleSignin.configure({
  webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
});

const onGoogleButtonPress = async () => {
  // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential);
};

export const GoogleSigninButton: FC = () => {
  const handleSignin = async () => {
    try {
      const signin = await onGoogleButtonPress();
      console.log("Signed in with Google!" + signin);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <RNGoogleSigninButton
      size={RNGoogleSigninButton.Size.Wide}
      color={RNGoogleSigninButton.Color.Light}
      onPress={handleSignin}
      // disabled={this.state.isSigninInProgress}
    />
  );
};
