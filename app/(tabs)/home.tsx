import React, { useState, useEffect, FC } from "react";
import { StyleSheet, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  registerMessageHandler,
  unsubscribeMessageHandler,
} from "../../utils/notifications";
import { Map } from "../../features/map/Map";
import { User } from "../../features/tracking-status/TrackingStatus";
import { Screen } from "../../features/screen/Screen";
import { useAuth } from "../../features/authentication/auth";
import { Loader } from "../../features/loader/Loader";

const Home: FC = () => {
  const { user } = useAuth();
  const [isUserTracked, setIsUserTracked] = useState(false);

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
        <User
          isUserTracked={isUserTracked}
          setIsUserTracked={setIsUserTracked}
        />
        <View style={styles.list}></View>
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
  trackingStatus: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
});

export default Home;
