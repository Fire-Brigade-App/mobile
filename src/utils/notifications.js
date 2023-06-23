import messaging from "@react-native-firebase/messaging";
import saveToken from "../api/saveToken";
import { Alert } from "react-native";

/** iOS - Requesting permissions
 * @link https://rnfirebase.io/messaging/usage#ios---requesting-permissions
 */
export const requestMessagingPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
  }
};

/** Register handler for Background & Quit state messages
 * @link https://rnfirebase.io/messaging/usage#background--quit-state-messages
 * */
export const registerBackgroundMessageHandler = () =>
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Message handled in the background!", remoteMessage);
  });

export const registerMessageHandler = () => {
  if (requestMessagingPermission()) {
    messaging()
      .getToken()
      .then(async (token) => {
        console.log("Run");
        await saveToken(token);
      });
  } else {
    console.log("Request messaging permission error");
  }

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(async (remoteMessage) => {
      if (remoteMessage) {
        console.log(
          "Notification caused app to open from quit state:",
          remoteMessage.notification
        );
      }
    });

  // Assume a message-notification contains a "type" property in the data payload of the screen to open
  messaging().onNotificationOpenedApp(async (remoteMessage) => {
    console.log(
      "Notification caused app to open from background state:",
      remoteMessage.notification
    );
  });
}

export const unsubscribeMessageHandler = messaging().onMessage(async (remoteMessage) => {
  Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
});