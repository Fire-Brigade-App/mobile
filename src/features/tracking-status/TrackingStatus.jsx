import React, { useEffect } from "react";
import {
  isBackgroundFetchTaskRegistered,
  registerBackgroundFetchAsync,
  unregisterBackgroundFetchAsync,
} from "../../utils/backgroundFetch";
import {
  hasStartedLocationUpdates,
  startLocationUpdates,
  stopLocationUpdates,
} from "../../utils/location";
import { StyleSheet, Switch, Text, View } from "react-native";

export const TrackingStatus = ({ isUserTracked, setIsUserTracked }) => {
  const checkTrackingStatus = async () => {
    const isBackgroundFetchActive = await isBackgroundFetchTaskRegistered();
    const isLocationUpdatesActive = await hasStartedLocationUpdates();
    console.log("isBackgroundFetchActive", isBackgroundFetchActive);
    console.log("isLocationUpdatesActive", isLocationUpdatesActive);

    const isTracked = isBackgroundFetchActive && isLocationUpdatesActive;
    setIsUserTracked(isTracked);
  };

  const toggleTracking = async () => {
    if (isUserTracked) {
      await stopLocationUpdates();
      await unregisterBackgroundFetchAsync();
    } else {
      await startLocationUpdates();
      await registerBackgroundFetchAsync();
    }

    checkTrackingStatus();
  };

  useEffect(() => {
    checkTrackingStatus();
  }, []);

  return (
    <View style={styles.trackingStatus}>
      <View style={styles.textContainer}>
        <Text>Tracking status</Text>
      </View>
      <Switch onValueChange={toggleTracking} value={isUserTracked} />
    </View>
  );
};

const styles = StyleSheet.create({
  trackingStatus: {
    borderBottomColor: "#DDDDDD",
    borderBottomWidth: 1,
    flexDirection: "row",
    // justifyContent: "space-between"
  },
  textContainer: {
    margin: 10,
    flex: 1,
  },
});
