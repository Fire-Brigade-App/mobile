import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { FC } from "react";
import { Link, useRouter } from "expo-router";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { AlertType } from "../../constants/AlertType";
import { UserStatusInAlert } from "../../constants/UserStatusInAlarm";
import { useAlerts } from "./userAlerts";
import { Screen } from "../screen/Screen";
import { colors } from "../../styles/colors";

export interface IAlert {
  added: FirebaseFirestoreTypes.Timestamp;
  address: string;
  type: AlertType;
  description: string;
  vehicles: string[];
  completed: FirebaseFirestoreTypes.Timestamp | null;
  users: {
    [userUid: string]: UserStatusInAlert;
  };
  location: FirebaseFirestoreTypes.GeoPoint;
  source: string;
  author: string;
}

export interface AlertWithId extends IAlert {
  id: string;
}

const AlertItem: FC<{ alert: AlertWithId }> = ({ alert }) => {
  const date = alert.added.toDate().toLocaleDateString();
  const time = alert.added.toDate().toLocaleTimeString();
  const type = alert.type[0].toUpperCase();
  const currentAlert = !alert.completed;

  return (
    <Link
      href={{
        pathname: "/alerts/[id]",
        params: { id: alert.id },
      }}
      style={[styles.alert, currentAlert && styles.currentAlert]}
    >
      <View>
        <Text>
          {date} {time}
        </Text>
        <Text>
          {type} | {alert.address}
        </Text>
      </View>
    </Link>
  );
};

const Alerts: FC = () => {
  const { alerts } = useAlerts();

  return (
    <Screen>
      <View style={styles.content}>
        <FlatList
          data={alerts}
          renderItem={({ item }) => <AlertItem alert={item} />}
          style={styles.alerts}
        />
      </View>
    </Screen>
  );
};

export default Alerts;

const styles = StyleSheet.create({
  content: {
    width: "100%",
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 8,
  },
  alerts: {},
  alert: {
    marginHorizontal: 20,
    marginVertical: 8,
    borderColor: "#dddddd",
    borderTopColor: colors.blue,
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: "#ffffff",
    padding: 15,
  },
  currentAlert: {
    backgroundColor: colors.alert,
  },
});
