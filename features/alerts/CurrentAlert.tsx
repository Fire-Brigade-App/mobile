import { StyleSheet, Text, View } from "react-native";
import React, { FC } from "react";
import { useAlerts } from "./userAlerts";

const CurrentAlert: FC = () => {
  const { currentAlert } = useAlerts();

  const time = currentAlert?.added
    .toDate()
    .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const address = currentAlert?.address;
  const type = currentAlert?.type.toUpperCase();
  const description = currentAlert?.description;
  const source = currentAlert?.source;
  const vehicles = currentAlert?.vehicles.map((vehicle) => vehicle).join(", ");

  if (!currentAlert) {
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
      <Text style={styles.details}>
        {source} {vehicles && ">"} {vehicles}
      </Text>
    </View>
  );
};

export default CurrentAlert;

const styles = StyleSheet.create({
  alert: {
    padding: 15,
    backgroundColor: "#FFC302",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  address: {
    fontWeight: "900",
  },
  time: {
    fontWeight: "300",
  },
  description: {
    // fontWeight: "300",
  },
  details: {
    fontWeight: "300",
    fontSize: 12,
    textAlign: "right",
  },
});
