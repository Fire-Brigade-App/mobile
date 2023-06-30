import React, { FC, PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

export const Screen: FC<PropsWithChildren> = ({ children }) => {
  return <View style={styles.screen}>{children}</View>;
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});
