import React from "react";
import { Stack } from "expo-router";
import { Screen } from "../../../../../features/screen/Screen";
import Users from "../../../../../features/settings/Users";

export default () => {
  return (
    <Screen>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Users",
        }}
      />
      <Users />
    </Screen>
  );
};
