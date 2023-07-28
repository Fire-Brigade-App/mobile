import { StyleSheet, View } from "react-native";
import React, { FC, useState } from "react";
import { Screen } from "../screen/Screen";
import { contentStyle } from "../../styles/content";
import { Text, Input, Button, YStack, Label, YGroup } from "tamagui";
import { AlertType } from "../../constants/AlertType";
import { post } from "../../api/api";
import { useAuth } from "../authentication/auth";
import { useBrigade } from "../status/useBrigade";
import { countriesMap } from "../../utils/countries";
import { useRouter } from "expo-router";
import ModalButton from "../../components/ModalButton";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const author = `${userData?.firstName} ${userData?.lastName}`;
  const country = countriesMap[brigade?.country];
  const municipality = brigade?.municipality;
  const source = "user";
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddAlert = async () => {
    setLoading(true);

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
    setLoading(false);
  };

  const handleAddAlertAndCheckERemiza = async () => {
    setLoading(true);

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
    setLoading(false);
  };

  return (
    <Screen>
      <View style={styles.content}>
        {Boolean(error) && <Text style={styles.error}>{error}</Text>}
        <YStack space="$3">
          <>
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={address} onChangeText={setAddress} />
          </>
          <>
            <Label htmlFor="description">Description</Label>
            <Input value={description} onChangeText={setDescription} />
          </>
          <>
            <Label>Type</Label>
            <YGroup>
              <YGroup.Item>
                <Button
                  backgroundColor={
                    AlertType.FIRE === type ? "$backgroundFocus" : "$background"
                  }
                  onPress={() => setType(AlertType.FIRE)}
                >
                  {AlertType.FIRE}
                </Button>
              </YGroup.Item>
              <YGroup.Item>
                <Button
                  backgroundColor={
                    AlertType.ACCIDENT === type
                      ? "$backgroundFocus"
                      : "$background"
                  }
                  onPress={() => setType(AlertType.ACCIDENT)}
                >
                  {AlertType.ACCIDENT}
                </Button>
              </YGroup.Item>
              <YGroup.Item>
                <Button
                  backgroundColor={
                    AlertType.THREAT === type
                      ? "$backgroundFocus"
                      : "$background"
                  }
                  onPress={() => setType(AlertType.THREAT)}
                >
                  {AlertType.THREAT}
                </Button>
              </YGroup.Item>
              <YGroup.Item>
                <Button
                  backgroundColor={
                    AlertType.PLANNED === type
                      ? "$backgroundFocus"
                      : "$background"
                  }
                  onPress={() => setType(AlertType.PLANNED)}
                >
                  {AlertType.PLANNED}
                </Button>
              </YGroup.Item>
            </YGroup>
          </>

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
        </YStack>
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
});
