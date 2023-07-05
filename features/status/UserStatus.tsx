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
import { useAuth } from "../authentication/auth";
import User from "./User";

export enum Status {
  // calculated time if user is in standby mode
  NEAR = "near", // green <5 min
  FAR = "far", // yellow 5<=10 min
  OUT = "out", // orange >10 min

  // user is in busy mode
  BUSY = "busy", // red

  // if last user update was in standby mode
  OFFLINE = "offline", // grey - no updates from 1<24 h
  INACTIVE = "inactive", // black - no updates from >24 h

  //
  CANDIDATE = "candidate",
  SUSPENDED = "suspended",
}

interface IUserStatus {
  isUserTracked: boolean;
  setIsUserTracked: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserStatus: FC<IUserStatus> = ({
  isUserTracked,
  setIsUserTracked,
}) => {
  const { userData } = useAuth();
  const brigadeId = userData ? Object.keys(userData?.brigades)[0] : null;

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
        {userData && (
          <User userData={userData} brigadeId={brigadeId} showDetails={false} />
        )}
      </View>
      <View style={styles.switch}>
        {isUserTracked ? (
          <Text style={[styles.mode, styles.standby]}>standby</Text>
        ) : (
          <Text style={[styles.mode, styles.busy]}>busy</Text>
        )}
        <Switch
          onValueChange={toggleTracking}
          value={isUserTracked}
          thumbColor={isUserTracked ? "#1da1f2" : "#DC143C"}
          trackColor={{ false: "#FFB6C1", true: "#87CEFA" }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  trackingStatus: {
    borderBottomColor: "#DDD",
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  textContainer: {
    margin: 10,
    flex: 1,
  },
  switch: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  mode: {
    textTransform: "uppercase",
    fontSize: 10,
    borderWidth: 1,
    paddingTop: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginRight: 4,
  },
  busy: {
    backgroundColor: "#FFF0F5",
    borderColor: "#DC143C",
    color: "#DC143C",
  },
  standby: {
    backgroundColor: "#F0F8FF",
    borderColor: "#1da1f2",
    color: "#1da1f2",
  },
});
