import React, { FC } from "react";
import { Stack } from "expo-router";
import AddAlert from "../../../features/alerts/AddAlert";

const AlertPage: FC = () => {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Add alert",
        }}
      />
      <AddAlert />
    </>
  );
};

export default AlertPage;
