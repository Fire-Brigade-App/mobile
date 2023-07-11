import { Slot } from "expo-router";
import { SafeAreaScreen } from "../../features/screen/SafeAreaScreen";

export default () => {
  return (
    <SafeAreaScreen>
      <Slot />
    </SafeAreaScreen>
  );
};
