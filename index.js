import "expo-router/entry";
import { registerBackgroundMessageHandler } from "./utils/notifications";
import { defineLocationTask } from "./utils/location";
import { defineBackgroundFetchTask } from "./utils/backgroundFetch";

// Register handler for Background & Quit state messages
registerBackgroundMessageHandler();

// Define global tasks
defineLocationTask();
defineBackgroundFetchTask();
