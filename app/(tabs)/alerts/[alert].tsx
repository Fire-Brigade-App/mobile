import React, { FC } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import Alert from "../../../features/alerts/Alert";

const AlertPage: FC = () => {
  const { alert } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Alert",
        }}
      />
      <Alert alertId={alert as string} />
    </>
  );
};

export default AlertPage;
