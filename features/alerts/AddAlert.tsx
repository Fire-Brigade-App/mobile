import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { FC, useState } from "react";
import { useRouter } from "expo-router";
import { Screen } from "../screen/Screen";
import { contentStyle } from "../../styles/content";
import { AlertType } from "../../constants/AlertType";
import { post } from "../../api/api";
import { useAuth } from "../authentication/auth";
import { useBrigade } from "../status/useBrigade";
import { countriesMap } from "../../utils/countries";
import ModalButton from "../../components/ModalButton";
import Group from "../../components/Group";

interface AlertData {
  address?: string;
  country?: string;
  municipality?: string;
  description?: string;
  type?: AlertType;
  author: string;
  source?: string;
}

const addAlert = async (brigadeId: string, alert: AlertData) => {
  try {
    const response = await post(`/alerts/${brigadeId}`, alert);
    return response;
  } catch (err) {
    console.error(err);
  }
};

const addAlertAndCheckERemiza = async (brigadeId: string, alert: AlertData) => {
  try {
    const response = await post(`/eremiza/${brigadeId}`, alert);
    return response;
  } catch (err) {
    console.error(err);
  }
};

const AddAlert: FC = () => {
  const { brigadeId, userData } = useAuth();
  const { brigade } = useBrigade();
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(AlertType.ALERT);
  const author = `${userData?.firstName} ${userData?.lastName}`;
  const country = countriesMap[brigade?.country];
  const municipality = brigade?.municipality;
  const source = "user";

  const handleAddAlert = async () => {
    try {
      await addAlert(brigadeId, {
        address,
        country,
        municipality,
        description,
        type,
        author,
        source,
      });

      setAddress("");
      setDescription("");
      setType(AlertType.FIRE);
      router.replace("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddAlertAndCheckERemiza = async () => {
    try {
      await addAlertAndCheckERemiza(brigadeId, {
        address,
        description: description || "Loading alert from e-Remiza...",
        author,
      });

      setAddress("");
      setDescription("");
      setType(AlertType.FIRE);
      router.replace("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Screen>
      <View style={styles.content}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={[styles.info, styles.input]}
          value={address}
          onChangeText={setAddress}
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.info, styles.input]}
          value={description}
          onChangeText={setDescription}
        />
        <Text style={styles.label}>Type</Text>
        <Group
          style={styles.info}
          items={[
            { label: AlertType.FIRE, value: AlertType.FIRE },
            { label: AlertType.ACCIDENT, value: AlertType.ACCIDENT },
            { label: AlertType.THREAT, value: AlertType.THREAT },
            { label: AlertType.TRAINING, value: AlertType.TRAINING },
            { label: AlertType.PLANNED, value: AlertType.PLANNED },
          ]}
          value={type}
          onChange={(value) => setType(value as AlertType)}
        />

        <ModalButton
          buttonText="Send alert"
          modalText="Are you sure?"
          onConfirm={handleAddAlert}
        />
        <Text style={styles.or}>or</Text>
        <ModalButton
          buttonText="Send alert & check e-Remiza"
          modalText="Are you sure?"
          onConfirm={handleAddAlertAndCheckERemiza}
        />
      </View>
    </Screen>
  );
};

export default AddAlert;

const styles = StyleSheet.create({
  content: contentStyle,
  error: {
    color: "red",
  },
  or: {
    textAlign: "right",
  },
  label: {
    fontSize: 12,
    color: "#777777",
  },
  info: {
    marginVertical: 8,
    minWidth: 100,
  },
  input: {
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    color: "#000000",
  },
});
