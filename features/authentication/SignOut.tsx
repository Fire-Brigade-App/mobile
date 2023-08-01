import React, { FC, useState } from "react";
import { signOut } from "./auth";
import { unregisterBackgroundFetchAsync } from "../../utils/backgroundFetch";
import { stopLocationUpdates } from "../../utils/location";
import { Pressable, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { Loader } from "../../components/loader/Loader";

export const SignOut: FC = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await unregisterBackgroundFetchAsync();
    await stopLocationUpdates();
    await signOut();
  };

  return (
    <Pressable style={{ flexDirection: "row" }} onPress={handleLogout}>
      {loading ? (
        <Loader />
      ) : (
        <MaterialIcons name="logout" size={24} color={colors.blue} />
      )}
      <Text
        style={{
          color: colors.blue,
          marginLeft: 2,
          fontWeight: "500",
        }}
      >
        Sign out
      </Text>
    </Pressable>
  );
};
