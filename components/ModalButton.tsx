import {
  Modal as RNModal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { FC, useState } from "react";
import TextButton from "./TextButton";
import XStack from "./XStack";
import { colors } from "../styles/colors";

interface IModalButton {
  buttonText: string;
  modalText: string;
  onConfirm: () => void;
}

const ModalButton: FC<IModalButton> = ({
  buttonText,
  modalText,
  onConfirm,
}) => {
  const [visible, setVisible] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setVisible(false);
  };

  return (
    <>
      <RNModal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          setVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalText}</Text>
            <XStack>
              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setVisible(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonConfirm]}
                onPress={handleConfirm}
              >
                <Text style={styles.textStyle}>Confirm</Text>
              </Pressable>
            </XStack>
          </View>
        </View>
      </RNModal>
      <TextButton title={buttonText} onPress={() => setVisible(true)} />
    </>
  );
};

export default ModalButton;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000080",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonCancel: {
    backgroundColor: colors.red,
  },
  buttonConfirm: {
    backgroundColor: colors.green,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
