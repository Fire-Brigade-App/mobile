import React, { useState, useEffect, FC } from "react";
import { StyleSheet, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { defineLocationTask } from "./src/utils/location";
import { defineBackgroundFetchTask } from "./src/utils/backgroundFetch";
import {
  registerMessageHandler,
  unsubscribeMessageHandler,
} from "./src/utils/notifications";
import { Map } from "./src/features/map/Map";
import { TrackingStatus } from "./src/features/tracking-status/TrackingStatus";
import { useLogin } from "./src/features/authentication/useLogin";
import { Screen } from "./src/features/screen/Screen";
import { Loader } from "./src/features/loader/Loader";
import { Login } from "./src/features/authentication/Login";
import { Logout } from "./src/features/authentication/Logout";

defineLocationTask();
defineBackgroundFetchTask();

const AppRoot: FC = () => {
  const { initializing, user } = useLogin();
  const [isUserTracked, setIsUserTracked] = useState(false);

  useEffect(() => {
    registerMessageHandler();

    return unsubscribeMessageHandler;
  }, []);

  if (initializing) return <Loader />;

  if (!user) return <Login />;

  return (
    <Screen>
      <View style={styles.map}>
        <Map isUserTracked={isUserTracked} />
      </View>
      <View style={styles.content}>
        <TrackingStatus
          isUserTracked={isUserTracked}
          setIsUserTracked={setIsUserTracked}
        />
        <Text>Welcome {user.email}</Text>
        <Logout />
        <View style={styles.list}></View>
      </View>
      <StatusBar style="auto" />
    </Screen>
  );
};

const styles = StyleSheet.create({
  login: {
    flex: 1,
    alignSelf: "stretch",
  },
  map: {
    flex: 1,
    alignSelf: "stretch",
  },
  content: {
    flex: 1,
    alignSelf: "stretch",
  },
  trackingStatus: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
});

export default AppRoot;
