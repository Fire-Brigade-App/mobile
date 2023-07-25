import { FlatList, StyleSheet, View } from "react-native";
import React, { FC } from "react";
import User from "./User";
import { UserDataWithUid } from "../../data/UserData";

const UsersList: FC<{ users: UserDataWithUid[]; brigadeId: string }> = ({
  users,
  brigadeId,
}) => {
  return (
    <FlatList
      data={users}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <View style={styles.user}>
          <User userData={item} brigadeId={brigadeId} />
        </View>
      )}
      keyExtractor={(user) => user.uid}
    />
  );
};

export default UsersList;

const styles = StyleSheet.create({
  user: {
    marginVertical: 4,
  },
});
