import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Link, Stack } from "expo-router";
import { titleStyle } from "../../../../styles/title";
import { Screen } from "../../../../features/screen/Screen";

const ManagementForm: FC = () => {
  return (
    <Screen>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Management",
        }}
      />
      <View style={styles.content}>
        <Link href="/settings/management/candidates" style={styles.link}>
          Candidates
        </Link>
      </View>
    </Screen>
  );
};

export default ManagementForm;

const styles = StyleSheet.create({
  content: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  link: {
    fontSize: 24,
    color: "#2196F3",
    fontWeight: "300",
    paddingVertical: 10,
  },
});
