import React, { useState, useEffect, FC } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  registerMessageHandler,
  unsubscribeMessageHandler,
} from "../../utils/notifications";
import { Map } from "../../features/map/Map";
import { UserStatus } from "../../features/status/UserStatus";
import { Screen } from "../../features/screen/Screen";
import { useAuth } from "../../features/authentication/auth";
import { Loader } from "../../features/loader/Loader";
import BrigadeStatus from "../../features/status/BrigadeStatus";

const Home: FC = () => {
  const { user, userData } = useAuth();
  const [isUserTracked, setIsUserTracked] = useState(false);
  // TODO: handle more than one brigade for the user
  const brigadeId = userData ? Object.keys(userData?.brigades)[0] : null;

  useEffect(() => {
    registerMessageHandler();

    return unsubscribeMessageHandler;
  }, []);

  if (!user) {
    return <Loader />;
  }

  return (
    <Screen>
      <View style={styles.map}>
        <Map isUserTracked={isUserTracked} />
      </View>
      <View style={styles.content}>
        <UserStatus
          isUserTracked={isUserTracked}
          setIsUserTracked={setIsUserTracked}
        />
        <View style={styles.brigadeStatus}>
          <BrigadeStatus brigadeId={brigadeId} />
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
  },
  brigadeStatus: {
    flex: 1,
  },
});

export default Home;
