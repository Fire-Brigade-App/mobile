import { StyleSheet, Text, View } from "react-native";
import React, { FC } from "react";
import { Status } from "./UserStatus";
import { User, UserRole } from "../../app/(auth)/user-data-form";

const UsersSummary: FC<{ users: User[]; brigadeId: string }> = ({
  users,
  brigadeId,
}) => {
  const firefighters = users.filter((user) =>
    [Status.NEAR, Status.FAR].includes(user?.brigades[brigadeId]?.status)
  );

  const commanders = firefighters.filter((user) =>
    user.brigades[brigadeId].roles.includes(UserRole.COMMANDER)
  );

  const drivers = firefighters.filter((user) =>
    user.brigades[brigadeId].roles.includes(UserRole.DRIVER)
  );

  const paramedics = firefighters.filter((user) =>
    user.brigades[brigadeId].roles.includes(UserRole.PARAMEDIC)
  );

  return (
    <View style={styles.summary}>
      <Text style={[styles.role, styles.all]}>
        {firefighters.length} in the area
      </Text>
      <Text style={[styles.role, styles.commander]}>
        {commanders.length} commanders
      </Text>
      <Text style={[styles.role, styles.driver]}>{drivers.length} drivers</Text>
      <Text style={[styles.role, styles.paramedic]}>
        {paramedics.length} medics
      </Text>
    </View>
  );
};

export default UsersSummary;

const styles = StyleSheet.create({
  summary: {
    flexDirection: "row",
    marginVertical: 5,
  },
  role: {
    paddingHorizontal: 10,
    marginRight: 5,
    borderWidth: 1,
    textAlign: "center",
    borderRadius: 10,
    fontSize: 10,
    lineHeight: 15,
    alignSelf: "center",
  },
  all: {
    color: "#222222",
    borderColor: "#222222",
    backgroundColor: "#F8F8FF",
  },
  paramedic: {
    color: "#DC143C",
    borderColor: "#DC143C",
    backgroundColor: "#F8F8FF",
  },
  driver: {
    color: "#20B2AA",
    borderColor: "#20B2AA",
    backgroundColor: "#F8F8FF",
  },
  commander: {
    color: "#4169E1",
    borderColor: "#4169E1",
    backgroundColor: "#F8F8FF",
  },
});
