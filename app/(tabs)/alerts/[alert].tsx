import React, { FC } from "react";
import { useLocalSearchParams } from "expo-router";
import Alert from "../../../features/alerts/Alert";

const AlertPage: FC = () => {
  const { alert } = useLocalSearchParams();

  return <Alert alertId={alert as string} />;
};

export default AlertPage;
