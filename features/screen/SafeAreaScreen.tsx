import React, { FC, PropsWithChildren } from "react";
import { Platform, SafeAreaView, StatusBar, StyleSheet } from "react-native";

export const SafeAreaScreen: FC<PropsWithChildren> = ({ children }) => {
  return <SafeAreaView style={styles.screen}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
