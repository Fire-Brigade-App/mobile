import React, { FC } from "react";
import { Pressable, Text } from "react-native";
import { Link, Stack } from "expo-router";
import Alerts from "../../../features/alerts/Alerts";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../../styles/colors";

const AlertsPage: FC = () => {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Alerts",
          headerRight: () => {
            return (
              <Link
                href="/alerts/add"
                style={{ justifyContent: "center" }}
                asChild
              >
                <Pressable style={{ flexDirection: "row" }}>
                  <MaterialIcons
                    name="add-alert"
                    size={20}
                    color={colors.blue}
                  />
                  <Text
                    style={{
                      color: colors.blue,
                      marginLeft: 2,
                      fontWeight: "500",
                    }}
                  >
                    Add alert
                  </Text>
                </Pressable>
              </Link>
            );
          },
        }}
      />
      <Alerts />
    </>
  );
};

export default AlertsPage;
