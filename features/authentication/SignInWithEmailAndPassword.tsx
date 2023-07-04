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
    } else {
      setError("Error code: " + error.code);
    }
  };

  return (
    <View>
      {Boolean(error) && <Text style={styles.error}>{error}</Text>}
      <TextInput
        style={styles.input}
        placeholder="email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button onPress={handleLogin} title="Login" />
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
  error: {
    color: "red",
  },
});
