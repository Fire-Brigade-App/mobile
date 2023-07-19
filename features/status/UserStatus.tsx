import React, { FC, useEffect, useState } from "react";
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
import { storeData } from "../../utils/asyncStorage";
import { LocalStorage } from "../../constants/localStorage";
import { Status } from "../../constants/status";
import { updateStatus } from "../../api/updateStatus";

interface IUserStatus {
  isUserTracked: boolean;
  setIsUserTracked: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserStatus: FC<IUserStatus> = ({
  isUserTracked,
  setIsUserTracked,
}) => {
  const { user, userData, brigadeId } = useAuth();
  const [disabledSwitch, setDisabledSwitch] = useState(false);
  const lastStatus = userData?.brigades[brigadeId]?.status;

  const checkTrackingStatus = async () => {
    const isBackgroundFetchActive = await isBackgroundFetchTaskRegistered();
    const isLocationUpdatesActive = await hasStartedLocationUpdates();
    console.log("isBackgroundFetchActive", isBackgroundFetchActive);
    console.log("isLocationUpdatesActive", isLocationUpdatesActive);

    const isTracked = isBackgroundFetchActive && isLocationUpdatesActive;
    const isBusy = lastStatus === Status.BUSY;

    // Handle cases when the state of the app is not synced with the database
    if (isTracked && isBusy) {
      // Clear location data from local storage due it could be outdated.
      await storeData(LocalStorage.USER_LOCATION, "");
      await updateStatus(user.uid, brigadeId, Status.OFFLINE);
    } else if (!isTracked && !isBusy) {
      // Clear location data from local storage due it could be outdated.
      await storeData(LocalStorage.USER_LOCATION, "");
      await updateStatus(user.uid, brigadeId, Status.BUSY);
    }

    setIsUserTracked(isTracked);
  };

  const handleChangeStatus = async (status: Status) => {
    await updateStatus(user.uid, brigadeId, status);
  };

  const toggleTracking = async () => {
    setDisabledSwitch(true);

    if (isUserTracked) {
      // Clear location data from local storage due to it could be outdated
      // after returning to the standby  mode.
      await storeData(LocalStorage.USER_LOCATION, "");
      await handleChangeStatus(Status.BUSY);
      await storeData(LocalStorage.BRIGADES_IDS, "[]");
      await stopLocationUpdates();
      await unregisterBackgroundFetchAsync();
    } else {
      await handleChangeStatus(Status.BUSY);
      await storeData(LocalStorage.BRIGADES_IDS, JSON.stringify([brigadeId]));
      await startLocationUpdates();
      await registerBackgroundFetchAsync();
    }

    checkTrackingStatus();
    setDisabledSwitch(false);
  };

  useEffect(() => {
    checkTrackingStatus();
  }, []);

  return (
    <View style={styles.trackingStatus}>
      <View style={styles.textContainer}>
        {userData && brigadeId && (
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
          disabled={disabledSwitch}
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
