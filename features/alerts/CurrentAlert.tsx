import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { FC, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { AntDesign } from "@expo/vector-icons";
import { useAlerts } from "./userAlerts";
import { useAuth } from "../authentication/auth";
import { UserStatusInAlert } from "../../constants/UserStatusInAlarm";
import XStack from "../../components/XStack";

const CurrentAlert: FC = () => {
  const { brigadeId, user } = useAuth();
  const { currentAlert } = useAlerts();
  const [disableButtons, setDisableButtons] = useState(false);
  const userStatusInAlert = currentAlert?.users[user?.uid] as
    | UserStatusInAlert
    | undefined;
  const confirmed = userStatusInAlert === UserStatusInAlert.CONFIRM;
  const rejected = userStatusInAlert === UserStatusInAlert.REJECT;
  const onTheWay = userStatusInAlert === UserStatusInAlert.ON_THE_WAY;

  const time = currentAlert?.added
    .toDate()
    .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const address = currentAlert?.address;
  const type = currentAlert?.type.toUpperCase();
  const description = currentAlert?.description;
  const source = currentAlert?.source;
  const author = currentAlert?.author;
  const vehicles = currentAlert?.vehicles.map((vehicle) => vehicle).join(", ");

  if (!currentAlert) {
    return null;
  }

  const handleDecision = async (state: UserStatusInAlert) => {
    setDisableButtons(true);
    if (
      !(state === UserStatusInAlert.CONFIRM && confirmed) &&
      !(state === UserStatusInAlert.REJECT && rejected)
    ) {
      try {
        await firestore()
          .collection("brigades")
          .doc(brigadeId)
          .collection("alerts")
          .doc(currentAlert.id)
          .update({
            [`users.${user.uid}`]: state,
          });
      } catch (error) {
        console.error(error);
      }
    }
    setDisableButtons(false);
  };

  return (
    <View style={styles.alert}>
      <View style={styles.row}>
        <Text style={styles.address}>
          {type}! {address}
        </Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.details}>
        {author} ({source}) {vehicles && ">"} {vehicles}
      </Text>
      <XStack style={styles.buttons}>
        <Pressable
          disabled={disableButtons}
          style={[styles.button, rejected && styles.rejectButtonPressed]}
          onPress={() => handleDecision(UserStatusInAlert.REJECT)}
        >
          <Text>Reject</Text>
          <AntDesign
            name="dislike1"
            size={24}
            color="#DC143C"
            style={styles.thumb}
          />
        </Pressable>
        <Pressable
          disabled={disableButtons}
          style={[
            styles.button,
            (confirmed || onTheWay) && styles.confirmButtonPressed,
          ]}
          onPress={() => handleDecision(UserStatusInAlert.CONFIRM)}
        >
          <Text>Confirm</Text>
          <AntDesign
            name="like1"
            size={24}
            color="#3CB371"
            style={styles.thumb}
          />
        </Pressable>
      </XStack>
    </View>
  );
};

export default CurrentAlert;

const styles = StyleSheet.create({
  alert: {
    padding: 15,
    backgroundColor: "#FFC302",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  address: {
    fontWeight: "900",
  },
  time: {
    fontWeight: "300",
  },
  description: {
    // fontWeight: "300",
  },
  details: {
    fontWeight: "300",
    fontSize: 12,
    textAlign: "right",
    marginBottom: 5,
  },
  buttons: {
    justifyContent: "flex-end",
  },
  button: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#444444",
    borderRadius: 10,
  },
  rejectButtonPressed: {
    backgroundColor: "#f16581",
  },
  confirmButtonPressed: {
    backgroundColor: "#80d4a5",
  },
  thumb: {
    marginLeft: 5,
  },
});
