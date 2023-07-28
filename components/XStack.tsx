import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import React, { FC, PropsWithChildren } from "react";

interface IXStack {
  style?: StyleProp<ViewStyle>;
}

const XStack: FC<IXStack & PropsWithChildren> = ({ children, style }) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

export default XStack;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    columnGap: 20,
  },
});
