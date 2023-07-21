import { StyleSheet, Text, View } from "react-native";
import React, { FC } from "react";
import { useBrigade } from "../status/useBrigade";
import { useAlerts } from "./userAlerts";

const CurrentAlert: FC = () => {
  const { isActiveAlert } = useBrigade();

  const { alerts } = useAlerts();
  const lastAlert = alerts.at(-1);

  const time = lastAlert?.added
    .toDate()
    .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const address = lastAlert?.address;
  const type = lastAlert?.type.toUpperCase();
  const description = lastAlert?.description;

  if (!isActiveAlert) {
    return null;
  }

  return (
    <View style={styles.alert}>
      <View style={styles.row}>
        <Text style={styles.address}>
          {type}! {address}
        </Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

export default CurrentAlert;

const styles = StyleSheet.create({
  alert: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  address: {
    fontWeight: "700",
  },
  time: {
    fontWeight: "300",
  },
  description: {
    fontWeight: "300",
  },
});
