import { StyleSheet, Text } from "react-native";
import React, { FC } from "react";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { formatDistance } from "date-fns";

const Updated: FC<{ updated: FirebaseFirestoreTypes.Timestamp }> = ({
  updated,
}) => {
  const label = formatDistance(updated.toDate(), new Date(), {
    addSuffix: true,
  });

  return <Text style={styles.updated}>updated {label}</Text>;
};

export default Updated;

const styles = StyleSheet.create({
  updated: {
    color: "#778899",
  },
});
