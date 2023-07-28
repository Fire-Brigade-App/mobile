import { StyleSheet, Text, View } from "react-native";
import React, { FC, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { Button, XStack } from "tamagui";
import { AntDesign } from "@expo/vector-icons";
import { useAlerts } from "./userAlerts";
import { useAuth } from "../authentication/auth";
import { UserStatusInAlert } from "../../constants/UserStatusInAlarm";

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
      <XStack space="$2" justifyContent="flex-end">
        <Button
          disabled={disableButtons}
          backgroundColor={rejected && "#f16581"}
          iconAfter={<AntDesign name="dislike1" size={24} color="#DC143C" />}
          onPress={() => handleDecision(UserStatusInAlert.REJECT)}
        >
          Reject
        </Button>
        <Button
          disabled={disableButtons}
          backgroundColor={(confirmed || onTheWay) && "#80d4a5"}
          iconAfter={<AntDesign name="like1" size={24} color="#3CB371" />}
          onPress={() => handleDecision(UserStatusInAlert.CONFIRM)}
        >
          Confirm
        </Button>
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
});
