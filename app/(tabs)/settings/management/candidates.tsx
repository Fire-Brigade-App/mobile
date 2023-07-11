import React from "react";
import { Stack } from "expo-router";
import Candidates from "../../../../features/settings/Candidates";
import { Screen } from "../../../../features/screen/Screen";

export default () => {
  return (
    <Screen>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Candidates",
        }}
      />
      <Candidates />
    </Screen>
  );
};
