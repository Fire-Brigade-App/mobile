import React, { FC, useEffect, useMemo } from "react";
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

enum UserMode {
  BUSY, // red
  STANDBY, // StandByState color,
}

enum UserStatus {
  // calculated time if user is in standby mode
  NEAR = "near", // green <5 min
  FAR = "far", // yellow 5<=10 min
  OUT = "out", // orange >10 min

  // user is in busy mode
  BUSY = "busy", // red

  // if last user update was in standby mode
  OFFLINE = "offline", // grey - no updates from 1<24 h
  INACTIVE = "inactive", // black - no updates from >24 h
}

interface IUserStatus {
  isUserTracked: boolean;
  setIsUserTracked: React.Dispatch<React.SetStateAction<boolean>>;
}

const formatTime = (time: string) => {
  if (time) {
    const hms = time.split(":");
    const h = Number(hms[0]) ? `${hms[0]} h` : "";
    const m = Number(hms[1]) ? `${hms[1]} min` : "";
    const s = Number(hms[2]) ? `${hms[2]} s` : "";
    return [h, m, s].filter((x) => x).join(" ");
  }

  return "";
};

export const User: FC<IUserStatus> = ({ isUserTracked, setIsUserTracked }) => {
  const { userData } = useAuth();

  const time = useMemo(
    () => (userData && userData.time ? formatTime(userData.time) : ""),
    [userData]
  );

  const styleStatus = useMemo(() => {
    return userData && userData.status
      ? styles[`${userData.status}Status`]
      : styles.blankStatus;
  }, [userData]);

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
          <View style={styles.user}>
            <View style={[styles.status, styleStatus]}></View>
            <Text>
              {userData.firstName} {userData.lastName}
            </Text>
            {Boolean(time) && <Text style={styles.time}>{time}</Text>}
          </View>
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
  user: {
    flexDirection: "row",
    alignItems: "center",
  },
  status: {
    marginRight: 8,
    width: 12,
    height: 12,
    borderRadius: 8,
  },
  nearStatus: {
    backgroundColor: "#3CB371",
  },
  farStatus: {
    backgroundColor: "#FFD700",
  },
  outStatus: {
    backgroundColor: "#D2691E",
  },
  busyStatus: {
    backgroundColor: "#DC143C",
  },
  offlineStatus: {
    backgroundColor: "#778899",
  },
  inactiveStatus: {
    backgroundColor: "#222222",
  },
  blankStatus: {
    backgroundColor: "transparent",
  },
  time: {
    marginLeft: 8,
    color: "#3CB371",
    borderColor: "#3CB371",
    textTransform: "uppercase",
    fontSize: 10,
    borderWidth: 1,
    paddingTop: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginRight: 10,
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
