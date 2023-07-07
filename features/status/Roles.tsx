import { FC } from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { Role } from "../../constants/role";

const rolesMap = {
  [Role.DRIVER]: "D",
  [Role.COMMANDER]: "C",
  [Role.PARAMEDIC]: "M",
  [Role.FIREFIGHTER]: "",
};

const Roles: FC<{ roles: Role[] }> = ({ roles }) => {
  return (
    <FlatList
      horizontal
      data={roles}
      renderItem={({ item }) =>
        rolesMap[item] && (
          <Text style={[styles.role, styles[item]]}>{rolesMap[item]}</Text>
        )
      }
    />
  );
};

export default Roles;

const styles = StyleSheet.create({
  role: {
    borderWidth: 1,
    textAlign: "center",
    borderRadius: 10,
    fontSize: 10,
    lineHeight: 15,
    alignSelf: "center",
    width: 20,
    height: 20,
    marginRight: 4,
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
