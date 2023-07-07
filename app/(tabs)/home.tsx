import React, { useState, FC } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Map } from "../../features/map/Map";
import { UserStatus } from "../../features/status/UserStatus";
import { Screen } from "../../features/screen/Screen";
import { useAuth } from "../../features/authentication/auth";
import { Loader } from "../../features/loader/Loader";
import BrigadeStatus from "../../features/status/BrigadeStatus";
import { useRegisterMessageHandler } from "../../utils/notifications";

const Home: FC = () => {
  const { brigadeId } = useAuth();
  const [isUserTracked, setIsUserTracked] = useState(false);

  useRegisterMessageHandler();

  if (!brigadeId) {
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
