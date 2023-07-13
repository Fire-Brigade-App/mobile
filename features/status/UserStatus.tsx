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
import firestore from "@react-native-firebase/firestore";
import { useAuth } from "../authentication/auth";
import User from "./User";
import { storeData } from "../../utils/asyncStorage";
import { LocalStorage } from "../../constants/localStorage";
import { Status } from "../../constants/status";

interface IUserStatus {
  isUserTracked: boolean;
  setIsUserTracked: React.Dispatch<React.SetStateAction<boolean>>;
}

const setBusyStatus = async (userUid: string, brigadeId: string) => {
  await firestore()
    .collection("users")
    .doc(userUid)
    .update({
      [`brigades.${brigadeId}.status`]: Status.BUSY,
      [`brigades.${brigadeId}.time`]: "0:0:0",
      updated: firestore.Timestamp.fromDate(new Date()),
    })
    .then(() => {
      console.log("User updated!");
    });
};

export const UserStatus: FC<IUserStatus> = ({
  isUserTracked,
  setIsUserTracked,
}) => {
  const { user, userData, brigadeId } = useAuth();

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
      await setBusyStatus(user.uid, brigadeId);
      await storeData(LocalStorage.BRIGADES_IDS, "[]");
      await stopLocationUpdates();
      await unregisterBackgroundFetchAsync();
    } else {
      await storeData(LocalStorage.BRIGADES_IDS, JSON.stringify([brigadeId]));
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
