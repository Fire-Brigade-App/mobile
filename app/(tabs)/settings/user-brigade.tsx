import React, { FC } from "react";
import UserBrigades from "../../../features/settings/UserBrigades";
import { StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { Screen } from "../../../features/screen/Screen";

const UserBrigadeForm: FC = () => {
  return (
    <Screen>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Your fire brigade",
        }}
      />
      <UserBrigades />
    </Screen>
  );
};

export default UserBrigadeForm;
