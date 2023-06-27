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
import { Screen } from "../screen/Screen";

enum ErrorCode {
  EMAIL_ALREADY_IN_USE = "auth/email-already-in-use",
  INVALID_EMAIL = "auth/invalid-email",
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

const handleError = (error) => {};

export const Login: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    let error = await createUserWithEmailAndPassword(email, password);
    if (error && error.code === ErrorCode.EMAIL_ALREADY_IN_USE) {
      error = await signInWithEmailAndPassword(email, password);
    }
    setLoading(false);
    if (error && error.code === ErrorCode.INVALID_EMAIL) {
      setError("That email address is invalid!");
    }
  };

  return (
    <Screen>
      <View style={styles.form}>
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
