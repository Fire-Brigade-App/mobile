import messaging from "@react-native-firebase/messaging";
import { Alert } from "react-native";
import { getData, storeData } from "./asyncStorage";
import { useEffect, useState } from "react";

/** iOS - Requesting permissions
 * @link https://rnfirebase.io/messaging/usage#ios---requesting-permissions
 */
export const requestMessagingPermission = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
    }
  } catch (error) {
    console.error(error);
  }
};

/** Register handler for Background & Quit state messages
 * @link https://rnfirebase.io/messaging/usage#background--quit-state-messages
 * */
export const registerBackgroundMessageHandler = () => {
  try {
    return messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
    });
  } catch (error) {
    console.error(error);
  }
};

export const registerMessageHandler = () => {
  try {
    requestMessagingPermission()
      .then(() => {
        messaging()
          .getToken()
          .then(async (token) => {
            await storeData("fcmToken", token);
          });
      })
      .catch(() => {
        console.log("Request messaging permission error");
      });

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
  } catch (error) {
    console.error(error);
  }
};

export const unsubscribeMessageHandler = messaging().onMessage(
  async (remoteMessage) => {
    Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
  }
);

export const useRegisterMessageHandler = () => {
  useEffect(() => {
    registerMessageHandler();

    return unsubscribeMessageHandler;
  }, []);
};

export const useFcmToken = () => {
  const [fcmToken, setFcmToken] = useState("");

  useEffect(() => {
    let didCancel = false;
    const getFcmToken = async () => {
      const token = await getData("fcmToken");
      if (!didCancel) setFcmToken(token);
    };

    getFcmToken();

    return () => {
      didCancel = true;
    };
  }, []);

  return { fcmToken };
};
