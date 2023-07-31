import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { FC, useEffect, useState } from "react";
import { Stack } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { Screen } from "../screen/Screen";
import { contentStyle } from "../../styles/content";
import { useAlert } from "./userAlert";
import { colors } from "../../styles/colors";
import { MaterialIcons } from "@expo/vector-icons";
import XStack from "../../components/XStack";
import { Loader } from "../../components/loader/Loader";
import { AlertType } from "../../constants/AlertType";
import { useBrigade } from "../status/useBrigade";

const Alert: FC<{ alertId: string }> = ({ alertId }) => {
  const { brigade } = useBrigade();
  const {
    added,
    completed,
    type,
    address,
    description,
    vehicles,
    source,
    author,
    updateAlert,
  } = useAlert(alertId);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editedType, setEditedType] = useState(AlertType.ALERT);
  const [editedAddress, setEditedAddress] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedVehicles, setEditedVehicles] = useState([]);

  const [editedAdded, setEditedAdded] = useState(null);
  const [showAddedDatePicker, setShowAddedDatePicker] = useState(false);
  const [showAddedTimePicker, setShowAddedTimePicker] = useState(false);

  const [editedCompleted, setEditedCompleted] = useState(null);
  const [showCompletedDatePicker, setShowCompletedDatePicker] = useState(false);
  const [showCompletedTimePicker, setShowCompletedTimePicker] = useState(false);

  useEffect(() => {
    type && setEditedType(type);
    address && setEditedAddress(address);
    description && setEditedDescription(description);
    vehicles && setEditedVehicles(vehicles);
    added && setEditedAdded(added.toDate());
    completed && setEditedCompleted(completed.toDate());
  }, [added, completed, address, description]);

  const handleSave = async () => {
    setLoading(true);
    await updateAlert({
      type: editedType,
      address: editedAddress,
      description: editedDescription,
      vehicles: editedVehicles,
      added: editedAdded,
      completed: editedCompleted,
    });
    setLoading(false);
    setEditMode(false);
  };

  const handleCancel = async () => {
    type && setEditedType(type);
    address && setEditedAddress(address);
    description && setEditedDescription(description);
    vehicles && setEditedVehicles(vehicles);
    added && setEditedAdded(added.toDate());
    completed && setEditedCompleted(completed.toDate());
    setEditMode(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Alert",
          headerRight: () => {
            return editMode ? (
              <XStack>
                <Pressable style={styles.headerButton} onPress={handleCancel}>
                  <MaterialIcons name="close" size={20} color={colors.blue} />
                  <Text style={styles.headerTextButton}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.headerButton} onPress={handleSave}>
                  {loading ? (
                    <Loader />
                  ) : (
                    <MaterialIcons name="check" size={20} color={colors.blue} />
                  )}
                  <Text style={styles.headerTextButton}>Save</Text>
                </Pressable>
              </XStack>
            ) : (
              <Pressable
                style={styles.headerButton}
                onPress={() => setEditMode(true)}
              >
                <MaterialIcons name="edit" size={20} color={colors.blue} />
                <Text style={styles.headerTextButton}>Edit alert</Text>
              </Pressable>
            );
          },
        }}
      />
      <Screen>
        <ScrollView style={styles.scollView}>
          <View style={styles.content}>
            <Text style={styles.label}>Type</Text>
            <Dropdown
              data={[
                { label: "Fire", value: AlertType.FIRE },
                { label: "Threat", value: AlertType.THREAT },
                { label: "Accident", value: AlertType.ACCIDENT },
                { label: "Training", value: AlertType.TRAINING },
                { label: "Planned", value: AlertType.PLANNED },
                { label: "False", value: AlertType.FALSE },
                { label: "Other", value: AlertType.ALERT },
              ]}
              labelField="label"
              valueField="value"
              value={editedType}
              disable={!editMode}
              style={[
                styles.select,
                styles.info,
                !editMode && styles.selectDisabled,
              ]}
              selectedTextStyle={styles.selectValue}
              onChange={(item) => setEditedType(item.value)}
            />
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[
                styles.info,
                styles.input,
                !editMode && styles.inputDisabled,
              ]}
              editable={editMode}
              defaultValue={editedAddress}
              onChangeText={setEditedAddress}
            ></TextInput>
            <Text style={styles.label}>Description</Text>
            <TextInput
              multiline
              textAlignVertical="top"
              style={[
                styles.info,
                styles.input,
                !editMode && styles.inputDisabled,
              ]}
              editable={editMode}
              defaultValue={editedDescription}
              onChangeText={setEditedDescription}
            />
            <Text style={styles.label}>Vehicles</Text>
            <MultiSelect
              data={
                brigade?.vehicles
                  ? brigade?.vehicles.map((vehicle) => ({
                      label: vehicle,
                      value: vehicle,
                    }))
                  : []
              }
              labelField="label"
              valueField="value"
              value={editedVehicles}
              disable={!editMode}
              style={[
                styles.select,
                styles.info,
                !editMode && styles.selectDisabled,
              ]}
              selectedTextStyle={styles.selectValue}
              placeholderStyle={styles.selectValue}
              onChange={(item) => setEditedVehicles(item)}
            />
            <Text style={styles.label}>Start time</Text>
            <XStack>
              <>
                <Text
                  style={[
                    styles.info,
                    styles.input,
                    !editMode && styles.inputDisabled,
                  ]}
                  onPress={() => editMode && setShowAddedDatePicker(true)}
                >
                  {editedAdded?.toLocaleDateString()}
                </Text>
                {showAddedDatePicker && (
                  <DateTimePicker
                    value={editedAdded}
                    onChange={(e) => {
                      if (e.type === "set") {
                        setEditedAdded(new Date(e.nativeEvent.timestamp));
                      }
                      e.type && setShowAddedDatePicker(false);
                    }}
                  />
                )}
              </>
              <>
                <Text
                  style={[
                    styles.info,
                    styles.input,
                    !editMode && styles.inputDisabled,
                  ]}
                  onPress={() => editMode && setShowAddedTimePicker(true)}
                >
                  {editedAdded?.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                {showAddedTimePicker && (
                  <DateTimePicker
                    mode="time"
                    value={editedAdded}
                    onChange={(e) => {
                      if (e.type === "set") {
                        setEditedAdded(new Date(e.nativeEvent.timestamp));
                      }
                      e.type && setShowAddedTimePicker(false);
                    }}
                  />
                )}
              </>
            </XStack>
            <Text style={styles.label}>End time</Text>
            <XStack>
              <>
                <Text
                  style={[
                    styles.info,
                    styles.input,
                    !editMode && styles.inputDisabled,
                  ]}
                  onPress={() => editMode && setShowCompletedDatePicker(true)}
                >
                  {editedCompleted?.toLocaleDateString()}
                </Text>
                {showCompletedDatePicker && (
                  <DateTimePicker
                    value={editedCompleted ?? new Date()}
                    minimumDate={editedAdded}
                    onChange={(e) => {
                      if (e.type === "set") {
                        setEditedCompleted(new Date(e.nativeEvent.timestamp));
                      }
                      e.type && setShowCompletedDatePicker(false);
                    }}
                  />
                )}
              </>
              <>
                <Text
                  style={[
                    styles.info,
                    styles.input,
                    !editMode && styles.inputDisabled,
                  ]}
                  onPress={() => editMode && setShowCompletedTimePicker(true)}
                >
                  {editedCompleted?.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                {showCompletedTimePicker && (
                  <DateTimePicker
                    mode="time"
                    minimumDate={editedAdded}
                    value={editedCompleted ?? new Date()}
                    onChange={(e) => {
                      if (e.type === "set") {
                        setEditedCompleted(new Date(e.nativeEvent.timestamp));
                      }
                      e.type && setShowCompletedTimePicker(false);
                    }}
                  />
                )}
              </>
            </XStack>
            <XStack>
              <View>
                <Text style={styles.label}>Source</Text>
                <Text>{source}</Text>
              </View>
              <View>
                <Text style={styles.label}>Author</Text>
                <Text>{author}</Text>
              </View>
            </XStack>
          </View>
        </ScrollView>
      </Screen>
    </>
  );
};

export default Alert;

const styles = StyleSheet.create({
  scollView: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: contentStyle,
  headerButton: {
    flexDirection: "row",
  },
  headerTextButton: {
    color: colors.blue,
    marginLeft: 2,
    fontWeight: "500",
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
  inputDisabled: {
    backgroundColor: "#cccccc",
  },
  select: {
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 4,
  },
  selectValue: {
    fontSize: 14,
  },
  selectDisabled: {
    backgroundColor: "#cccccc",
  },
});
