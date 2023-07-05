import { FlatList, StyleSheet, View } from "react-native";
import React, { FC } from "react";
import User from "./User";
import { User as IUser } from "../../app/(auth)/user-data-form";

const UsersList: FC<{ users: IUser[]; brigadeId: string }> = ({
  users,
  brigadeId,
}) => {
  return (
    <FlatList
      data={users}
      renderItem={({ item }) => (
        <View style={styles.user}>
          <User userData={item} brigadeId={brigadeId} />
        </View>
      )}
      keyExtractor={(user) => user.firstName}
    />
  );
};

export default UsersList;

const styles = StyleSheet.create({
  user: {
    marginVertical: 4,
  },
});
