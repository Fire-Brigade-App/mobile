import React, { FC, useState } from "react";
import { ActivityIndicator, Button } from "react-native";
import { signOut } from "./auth";

export const SignOut: FC = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await signOut();
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
