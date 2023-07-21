import { Stack } from "expo-router";
import { useFonts } from "expo-font";
// import { useColorScheme } from "react-native";
import { TamaguiProvider, Theme } from "tamagui";
import { AuthProvider } from "../features/authentication/auth";

import config from "./../tamagui.config";

const StackLayout = () => {
  // const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <TamaguiProvider config={config}>
        {/* <Theme name={colorScheme === "dark" ? "dark" : "light"}> */}
        <Theme name="light">
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </Theme>
      </TamaguiProvider>
    </AuthProvider>
  );
};

export default StackLayout;
