import { FC } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import UsersList from "./UsersList";
import UsersSummary from "./UsersSummary";
import { useUsers } from "./useUsers";
import { Status } from "../../constants/status";
import { useAuth } from "../authentication/auth";
import { Activity } from "../../constants/Activity";

const BrigadeStatus: FC = () => {
  const { brigadeId } = useAuth();
  const { users } = useUsers(brigadeId);

  const standby = users.filter(
    (user) =>
      [Status.NEAR, Status.FAR].includes(user?.brigades[brigadeId]?.status) &&
      [Activity.ONLINE].includes(user?.activity)
  );

  const rest = users.filter(
    (user) =>
      ![Status.NEAR, Status.FAR].includes(user?.brigades[brigadeId]?.status) ||
      ![Activity.ONLINE].includes(user?.activity)
  );

  return (
    <ScrollView style={styles.scrollview}>
      <View style={styles.container}>
        <UsersSummary users={users} brigadeId={brigadeId} />
        <UsersList users={standby} brigadeId={brigadeId} />
        {!!standby.length && !!rest.length && (
          <View style={styles.seprarator}></View>
        )}
        <UsersList users={rest} brigadeId={brigadeId} />
      </View>
    </ScrollView>
  );
};

export default BrigadeStatus;

const styles = StyleSheet.create({
  scrollview: {
    flex: 1,
  },
  container: {
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  seprarator: {
    borderTopColor: "#D3D3D3",
    borderTopWidth: 1,
    borderStyle: "dashed",
  },
});
