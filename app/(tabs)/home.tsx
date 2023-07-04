import React, { useState, useEffect, FC } from "react";
import { StyleSheet, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  registerMessageHandler,
  unsubscribeMessageHandler,
} from "../../utils/notifications";
import { Map } from "../../features/map/Map";
import { TrackingStatus } from "../../features/tracking-status/TrackingStatus";
import { useLogin } from "../../features/authentication/useLogin";
import { Screen } from "../../features/screen/Screen";
import { Loader } from "../../features/loader/Loader";
import { Login } from "../../features/authentication/Login";
import { Logout } from "../../features/authentication/Logout";
import { UserDataForm } from "../../features/authentication/UserDataForm";

const Home: FC = () => {
  const { initializing, user, userData } = useLogin();
  const [isUserTracked, setIsUserTracked] = useState(false);

  useEffect(() => {
    registerMessageHandler();

    return unsubscribeMessageHandler;
  }, []);

  if (initializing) return <Loader />;

  if (!user) return <Login />;

  if (!userData) return <UserDataForm user={user} />;

  return (
    <Screen>
      <View style={styles.map}>
        <Map isUserTracked={isUserTracked} />
      </View>
      <View style={styles.content}>
        <TrackingStatus
          isUserTracked={isUserTracked}
          setIsUserTracked={setIsUserTracked}
        />
        <Text>Welcome {user.email}</Text>
        <Text>UID: {user.uid}</Text>
        <Text>
          Name: {userData.firstName} {userData.lastName}
        </Text>
        <Text>Brigades: {JSON.stringify(userData.brigades)}</Text>
        <Logout />
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
