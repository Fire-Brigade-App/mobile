import { Tabs } from "expo-router";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRegisterMessageHandler } from "../../utils/notifications";

export default () => {
  // Register foregound notification handlers
  useRegisterMessageHandler();

  return (
    <Tabs>
      <Tabs.Screen
        name="dashboard"
        options={{
          headerShown: false,
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="map-clock" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          headerShown: false,
          title: "Alerts",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="fire-alert" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <AntDesign name="setting" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};
