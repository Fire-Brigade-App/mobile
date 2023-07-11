import React from "react";
import { Screen } from "../../../../../features/screen/Screen";
import User from "../../../../../features/settings/User";
import { useLocalSearchParams } from "expo-router";

export default () => {
  const { user } = useLocalSearchParams();

  return (
    <Screen>
      <User userUid={user as string} />
    </Screen>
  );
};
