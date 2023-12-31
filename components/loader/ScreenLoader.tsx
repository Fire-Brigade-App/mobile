import React, { FC } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Screen } from "../../features/screen/Screen";

export const ScreenLoader: FC = () => {
  return (
    <Screen>
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
  },
});
