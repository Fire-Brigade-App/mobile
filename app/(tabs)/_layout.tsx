import { Tabs } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useRegisterMessageHandler } from "../../utils/notifications";

export default () => {
  // Register foregound notification handlers
  useRegisterMessageHandler();

  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
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
