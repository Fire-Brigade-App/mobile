import React, { FC } from "react";
import UserName from "../../../features/settings/UserName";
import { Stack } from "expo-router";
import { Screen } from "../../../features/screen/Screen";

const UserNameForm: FC = () => {
  return (
    <Screen>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Your profile",
        }}
      />
      <UserName />
    </Screen>
  );
};

export default UserNameForm;
