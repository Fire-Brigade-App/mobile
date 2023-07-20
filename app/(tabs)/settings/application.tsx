import React, { FC } from "react";
import { Stack } from "expo-router";
import { Screen } from "../../../features/screen/Screen";
import Application from "../../../features/settings/Application";

const UserNameForm: FC = () => {
  return (
    <Screen>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Application",
        }}
      />
      <Application />
    </Screen>
  );
};

export default UserNameForm;
