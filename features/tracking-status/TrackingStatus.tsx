import React, { FC, useEffect } from "react";
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

interface ITrackingStatus {
  isUserTracked: boolean;
  setIsUserTracked: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TrackingStatus: FC<ITrackingStatus> = ({
  isUserTracked,
  setIsUserTracked,
}) => {
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
  },
  textContainer: {
    margin: 10,
    flex: 1,
  },
});
