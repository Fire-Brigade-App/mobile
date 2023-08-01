import React, { FC, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useAuth } from "./auth";
import TextButton from "../../components/TextButton";
import { Loader } from "../../components/loader/Loader";
import { inputStyle } from "../../styles/input";
import { labelStyle } from "../../styles/label";

enum ErrorCode {
  EMAIL_ALREADY_IN_USE = "auth/email-already-in-use",
  INVALID_EMAIL = "auth/invalid-email",
  USER_DISABLED = "auth/user-disabled",
}

const createUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  return auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      return "";
    })
    .catch((error) => {
      return error;
    });
};

const signInWithEmailAndPassword = async (email: string, password: string) => {
  return auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      return "";
    })
    .catch((error) => {
      return error;
    });
};

export const SignInWithEmailAndPassword: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const disabled = !email || !password;
  // const { user } = useAuth();
  // const [resendLoading, setResendLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    let error = await createUserWithEmailAndPassword(email, password);
    if (error && error.code === ErrorCode.EMAIL_ALREADY_IN_USE) {
      error = await signInWithEmailAndPassword(email, password);
    }
    setLoading(false);

    if (error && error.code === ErrorCode.INVALID_EMAIL) {
      setError("That email address is invalid!");
    } else if (error && error.code === ErrorCode.USER_DISABLED) {
      setError("That account is disabled! Please contact your administrator.");
    } else if (error) {
      setError("Error code: " + error.code);
    }
  };

  // const sendEmailVerification = async () => {
  //   console.log("Starting verification");
  //   setResendLoading(true);
  //   try {
  //     const message = await auth().currentUser.sendEmailVerification();
  //     console.log(message);
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   setResendLoading(false);
  //   console.log("End verification");
  // };

  return (
    <View>
      {Boolean(error) && <Text style={styles.error}>{error}</Text>}
      {/* {user && !user?.emailVerified && (
        <View style={styles.verifyEmailBox}>
          <Text style={styles.verifyEmail}>
            Verification link sent to your email ({user?.email}). Please click
            the link to activate your account or
          </Text>
          {resendLoading ? (
            <Loader />
          ) : (
            <TextButton
              align="center"
              title="send verification link again"
              onPress={sendEmailVerification}
            />
          )}
        </View>
      )} */}
      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <TextButton
          disabled={disabled}
          onPress={handleLogin}
          align="center"
          title="Login"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: labelStyle,
  input: {
    ...inputStyle,
    marginVertical: 8,
  },
  error: {
    color: "red",
  },
  // verifyEmailBox: {
  //   padding: 20,
  //   borderColor: "mediumseagreen",
  //   borderWidth: 2,
  //   backgroundColor: "mintcream",
  //   borderRadius: 20,
  //   marginBottom: 15,
  // },
  // verifyEmail: {
  //   color: "mediumseagreen",
  // },
});
