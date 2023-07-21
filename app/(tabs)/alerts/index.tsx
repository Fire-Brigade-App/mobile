import React, { FC } from "react";
import { Stack } from "expo-router";
import Alerts from "../../../features/alerts/Alerts";

const AlertsPage: FC = () => {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Alerts",
        }}
      />
      <Alerts />
    </>
  );
};

export default AlertsPage;
