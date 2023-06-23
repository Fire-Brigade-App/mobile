import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { defineLocationTask } from "./src/utils/location";
import { defineBackgroundFetchTask } from "./src/utils/backgroundFetch";
import {
  registerMessageHandler,
  unsubscribeMessageHandler,
} from "./src/utils/notifications";
import { configMapbox } from "./src/features/map/mapbox";
import { Map } from "./src/features/map/Map";
import { TrackingStatus } from "./src/features/tracking-status/TrackingStatus";

configMapbox();
defineLocationTask();
defineBackgroundFetchTask();

export default function AppRoot() {
  const [isUserTracked, setIsUserTracked] = useState(false);

  useEffect(() => {
    registerMessageHandler();

    return unsubscribeMessageHandler;
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.map}>
        <Map isUserTracked={isUserTracked} />
      </View>
      <View style={styles.content}>
        <TrackingStatus
          isUserTracked={isUserTracked}
          setIsUserTracked={setIsUserTracked}
        />
        <View style={styles.list}></View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
