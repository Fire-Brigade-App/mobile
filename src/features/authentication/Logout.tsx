import React, { FC, useState } from "react";
import auth from "@react-native-firebase/auth";
import { ActivityIndicator, Button } from "react-native";

const logout = async () => {
  return auth()
    .signOut()
    .then(() => console.log("User signed out!"));
};

export const Logout: FC = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button onPress={handleLogout} title="Logout" />
      )}
    </>
  );
};
