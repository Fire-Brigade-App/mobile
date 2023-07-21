import React, { useState, FC } from "react";
import { StyleSheet, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useKeepAwake } from "expo-keep-awake";
import { Map } from "../../features/map/Map";
import { UserStatus } from "../../features/status/UserStatus";
import { Screen } from "../../features/screen/Screen";
import { useAuth } from "../../features/authentication/auth";
import { ScreenLoader } from "../../components/loader/ScreenLoader";
import BrigadeStatus from "../../features/status/BrigadeStatus";
import CurrentAlert from "../../features/alerts/CurrentAlert";

const Dashboard: FC = () => {
  const { brigadeId, isAccepted } = useAuth();
  const [isUserTracked, setIsUserTracked] = useState(false);

  // That prevents the screen from sleeping.
  useKeepAwake();

  if (!brigadeId) {
    return <ScreenLoader />;
  }

  if (!isAccepted) {
    return (
      <Screen>
        <View style={styles.notAcceptedBox}>
          <Text style={styles.notAccepted}>
            You are not autorized yet by the fire brigade administrator
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.map}>
        <Map isUserTracked={isUserTracked} />
      </View>
      <View style={styles.content}>
        <CurrentAlert />
        <UserStatus
          isUserTracked={isUserTracked}
          setIsUserTracked={setIsUserTracked}
        />
        <View style={styles.brigadeStatus}>
          <BrigadeStatus />
        </View>
      </View>
      <StatusBar style="auto" />
    </Screen>
  );
};

const styles = StyleSheet.create({
  login: {
    flex: 1,
    alignSelf: "stretch",
  },
  map: {
    flex: 1,
    alignSelf: "stretch",
  },
  content: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: "#ffffff",
  },
  brigadeStatus: {
    flex: 1,
  },
  notAcceptedBox: {
    justifyContent: "center",
    flex: 1,
    padding: 20,
  },
  notAccepted: {
    color: "#CCCCCC",
    fontSize: 20,
    textAlign: "center",
  },
});

export default Dashboard;
