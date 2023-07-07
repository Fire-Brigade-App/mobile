import { FC } from "react";
import { StyleSheet, View } from "react-native";
import UsersList from "./UsersList";
import UsersSummary from "./UsersSummary";
import { useUsers } from "./useUsers";
import { Status } from "../../constants/status";

const BrigadeStatus: FC<{ brigadeId: string }> = ({ brigadeId }) => {
  const { users } = useUsers(brigadeId);

  const standby = users.filter((user) =>
    [Status.NEAR, Status.FAR].includes(user?.brigades[brigadeId]?.status)
  );

  const rest = users.filter(
    (user) =>
      ![Status.NEAR, Status.FAR].includes(user?.brigades[brigadeId]?.status)
  );

  return (
    <View style={styles.container}>
      <UsersSummary users={users} brigadeId={brigadeId} />
      <UsersList users={standby} brigadeId={brigadeId} />
      {!!standby.length && !!rest.length && (
        <View style={styles.seprarator}></View>
      )}
      <UsersList users={rest} brigadeId={brigadeId} />
    </View>
  );
};

export default BrigadeStatus;

const styles = StyleSheet.create({
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
