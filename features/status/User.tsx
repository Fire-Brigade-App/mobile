import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { FC, useMemo, useState } from "react";
import Roles from "./Roles";
import Updated from "./Updated";
import { UserData } from "../../data/UserData";
import { Status } from "../../constants/status";

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

const User: FC<{
  userData: UserData;
  brigadeId: string;
  showDetails?: boolean;
}> = ({ userData, brigadeId, showDetails = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const brigade = userData?.brigades[brigadeId];
  const updated = userData?.updated;
  const roles = brigade?.roles;
  const status = brigade?.status;

  const time = useMemo(
    () => (userData && brigade?.time ? formatTime(brigade?.time) : ""),
    [userData]
  );

  const styleStatus =
    userData && brigade?.status
      ? styles[`${brigade?.status}Status`]
      : styles.blankStatus;

  const styleTime =
    userData && brigade?.status
      ? styles[`${brigade?.status}Time`]
      : styles.blankTime;

  return (
    <>
      <Pressable
        style={styles.user}
        onLongPress={() => setIsExpanded((prev) => !prev)}
      >
        <View style={[styles.status, styleStatus]}></View>
        <Text style={styles.name}>
          {userData.firstName} {userData.lastName}
        </Text>
        {showDetails && (
          <>
            {Boolean(roles) && <Roles roles={roles} />}
            {status !== Status.BUSY && (
              <Text style={[styles.time, styleTime]}>{time}</Text>
            )}
          </>
        )}
      </Pressable>
      {showDetails && isExpanded && (
        <View style={styles.expanded}>
          {Boolean(updated) && <Updated updated={updated} />}
        </View>
      )}
    </>
  );
};

export default User;

const styles = StyleSheet.create({
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
    backgroundColor: "#BDB76B",
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
  name: {
    marginRight: 8,
  },
  time: {
    textTransform: "uppercase",
    fontSize: 10,
    borderWidth: 1,
    paddingTop: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginLeft: 10,
  },
  nearTime: {
    color: "#3CB371",
    borderColor: "#3CB371",
  },
  farTime: {
    color: "#BDB76B",
    borderColor: "#BDB76B",
  },
  outTime: {
    color: "#D2691E",
    borderColor: "#D2691E",
  },
  blankTime: {
    color: "#222222",
    borderColor: "#222222",
  },
  expanded: {},
});
