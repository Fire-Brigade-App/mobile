import { StyleSheet, Text, View } from "react-native";
import React, { FC } from "react";
import { Screen } from "../screen/Screen";
import { contentStyle } from "../../styles/content";
import { useAlert } from "./userAlert";

const Alert: FC<{ alertId: string }> = ({ alertId }) => {
  const { addedDate, addedTime, type, address, description, vehicles, source } =
    useAlert(alertId);

  return (
    <Screen>
      <View style={styles.content}>
        <Text style={styles.info}>{type}</Text>
        <Text style={styles.info}>{address}</Text>
        <Text style={styles.info}>{description}</Text>
        <Text style={styles.info}>{vehicles}</Text>
        <Text style={styles.info}>
          {addedDate} {addedTime}
        </Text>
        <Text style={styles.info}>Source: {source}</Text>
      </View>
    </Screen>
  );
};

export default Alert;

const styles = StyleSheet.create({
  content: contentStyle,
  info: {
    paddingVertical: 8,
  },
});
