import { Stack } from "expo-router";
import { AuthProvider } from "../features/authentication/auth";

const StackLayout = () => {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
};

export default StackLayout;
