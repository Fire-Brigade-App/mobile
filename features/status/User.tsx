import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { FC, useMemo, useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import Roles from "./Roles";
import Updated from "./Updated";
import { UserDataWithUid } from "../../data/UserData";
import { Activity } from "../../constants/Activity";
import { useAlerts } from "../alerts/userAlerts";
import { UserStatusInAlert } from "../../constants/UserStatusInAlarm";

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
  userData: UserDataWithUid;
  brigadeId: string;
  showDetails?: boolean;
}> = ({ userData, brigadeId, showDetails = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const brigade = userData?.brigades[brigadeId];
  const updated = userData?.updated;
  const roles = brigade?.roles;

  const time = useMemo(
    () => (userData && brigade?.time ? formatTime(brigade?.time) : ""),
    [userData]
  );

  const isOnline = userData.activity === Activity.ONLINE;
  const color = (isOnline ? brigade?.status : userData?.activity) || "blank";
  const styleColor = styles[`${color}Color`];
  const styleTime = styles[`${color}Time`];

  const { currentAlert } = useAlerts();
  const statusInAlert = currentAlert?.users[userData.uid];
  const alertConfirmed = statusInAlert === UserStatusInAlert.CONFIRM;
  const alertRejected = statusInAlert === UserStatusInAlert.REJECT;
  const alertOnTheWay = statusInAlert === UserStatusInAlert.ON_THE_WAY;

  return (
    <>
      <Pressable
        style={styles.user}
        onLongPress={() => setIsExpanded((prev) => !prev)}
      >
        <View style={[styles.status, styleColor]}></View>
        {currentAlert && (
          <View style={styles.statusInAlert}>
            {alertConfirmed && (
              <AntDesign name="like1" size={20} color="#3CB371" />
            )}
            {alertRejected && (
              <AntDesign name="dislike1" size={20} color="#DC143C" />
            )}
            {alertOnTheWay && (
              <MaterialIcons name="speed" size={20} color="#3CB371" />
            )}
          </View>
        )}
        <Text style={styles.name}>
          {userData.firstName} {userData.lastName}
        </Text>
        {showDetails && (
          <>
            {Boolean(roles) && <Roles roles={roles} />}
            {isOnline && <Text style={[styles.time, styleTime]}>{time}</Text>}
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
  statusInAlert: {
    marginRight: 8,
  },
  nearColor: {
    backgroundColor: "#3CB371",
  },
  farColor: {
    backgroundColor: "#BDB76B",
  },
  outColor: {
    backgroundColor: "#D2691E",
  },
  busyColor: {
    backgroundColor: "#DC143C",
  },
  offlineColor: {
    backgroundColor: "#778899",
  },
  inactiveColor: {
    backgroundColor: "#222222",
  },
  blankColor: {
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
