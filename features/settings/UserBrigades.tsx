import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import { useAuth } from "../authentication/auth";
import { ScreenLoader } from "../../components/loader/ScreenLoader";
import { inputStyle } from "../../styles/input";
import { Brigade } from "../../data/Brigade";
import { BrigadeStatus } from "../../constants/BrigadeStatus";
import { BrigadePermissions } from "../../constants/BrigadePermissions";
import { Role } from "../../constants/Role";
import { Status } from "../../constants/Status";
import { titleStyle } from "../../styles/title";
import TextButton from "../../components/TextButton";
import { contentStyle } from "../../styles/content";
import { Activity } from "../../constants/Activity";
import { labelStyle } from "../../styles/label";

interface BrigadeWithUid extends Brigade {
  uid: string;
}

const getBrigades = async (name: string) => {
  const brigades = firestore().collection("brigades");
  const brigadesDocs = await brigades.where("name", "==", name).get();
  if (brigadesDocs.size) {
    const findings: BrigadeWithUid[] = brigadesDocs.docs.map((doc) => ({
      ...(doc.data() as Brigade),
      uid: doc.id,
    }));
    return findings;
  }
  return [];
};

const getBrigadeById = async (brigadeId: string) => {
  const brigadeDocRef = await firestore()
    .collection("brigades")
    .doc(brigadeId)
    .get();
  const brigade = brigadeDocRef.data();
  return brigade;
};

interface NewBrigadeData {
  userUid: string;
  brigadeName: string;
  country: string;
  province: string;
  municipality: string;
  latitude: number;
  longitude: number;
}

const createBrigade = async (brigadeData: NewBrigadeData) => {
  const {
    userUid,
    brigadeName: name,
    country,
    province,
    municipality,
    latitude,
    longitude,
  } = brigadeData;

  const newBrigade: Brigade = {
    name,
    country,
    province,
    municipality,
    location: new firestore.GeoPoint(Number(latitude), Number(longitude)),
    permissions: { [userUid]: [BrigadePermissions.ADMIN] },
    status: BrigadeStatus.STANDBY,
    alerts: [],
    vehicles: [],
  };

  const brigadeDocRef = await firestore()
    .collection("brigades")
    .add(newBrigade);

  return brigadeDocRef;
};

const UserBrigadeForm: FC<{ isInitial?: boolean }> = ({
  isInitial = false,
}) => {
  const { initializing, user, userData } = useAuth();
  const userUid = user.uid;

  const [searchBrigade, setSearchBrigade] = useState("");
  const [loading, setLoading] = useState(false);
  const [brigades, setBrigades] = useState(null);
  const [brigade, setBrigade] = useState(null);

  const [isCreatingBrigade, setIsCreatingBrigade] = useState(false);
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const isFormValid =
    brigade ||
    (isCreatingBrigade &&
      searchBrigade &&
      country &&
      province &&
      municipality &&
      latitude &&
      longitude);

  // this component could be shown in the initial state just before signing in
  // if the user data is not existing
  const isNotInitialized = !!userData?.brigades;
  const savedBrigade = isNotInitialized
    ? Object.keys(userData?.brigades)[0]
    : null;
  const showSaveButton = savedBrigade !== brigade?.uid;
  const saveButton = isInitial ? "Save" : "Next";

  useEffect(() => {
    let didCancel = false;
    const getUserBrigade = async () => {
      const brigadeId = Object.keys(userData?.brigades)[0];
      const brigade = await getBrigadeById(brigadeId);
      if (!didCancel) setBrigade({ uid: brigadeId, ...brigade });
    };

    if (userData?.brigades) {
      getUserBrigade();
    }

    return () => {
      didCancel = true;
    };
  }, [userData?.brigades]);

  const handleSave = async () => {
    setIsSaving(true);
    let brigadeId = brigade?.uid;
    let status = Status.CANDIDATE;

    if (isCreatingBrigade) {
      const brigadeData = {
        userUid,
        brigadeName: searchBrigade,
        country,
        province,
        municipality,
        latitude,
        longitude,
      };

      const brigadeDocRef = await createBrigade(brigadeData);
      brigadeId = brigadeDocRef.id;
      status = Status.EMPTY;
    }

    await firestore()
      .collection("users")
      .doc(userUid)
      .update({
        activity: Activity.INACTIVE,
        brigades: {
          [brigadeId]: {
            roles: [Role.FIREFIGHTER],
            status,
            time: "0:0:0",
          },
        },
      });

    setIsSaving(false);
  };

  useEffect(() => {
    let brigades = [];
    let didCancel = false;
    let timeout: NodeJS.Timeout;

    if (!searchBrigade) {
      setBrigades(null);
    } else {
      timeout = setTimeout(async () => {
        setLoading(true);
        brigades = await getBrigades(searchBrigade);
        if (!didCancel) setBrigades(brigades);
        setLoading(false);
      }, 1500);
    }

    return () => {
      didCancel = true;
      clearTimeout(timeout);
    };
  }, [searchBrigade]);

  if (initializing) {
    return <ScreenLoader />;
  }

  return (
    <View style={styles.content}>
      {isInitial && <Text style={styles.title}>Your fire brigade</Text>}
      {/* Show text input for searcing brigades if none is selected */}
      {!brigade && (
        <>
          <Text style={styles.label}>Fire brigade</Text>
          <TextInput
            style={styles.input}
            value={searchBrigade}
            onChangeText={setSearchBrigade}
          />
        </>
      )}

      {isCreatingBrigade ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="country"
            onChangeText={setCountry}
          />
          <TextInput
            style={styles.input}
            placeholder="province"
            onChangeText={setProvince}
          />
          <TextInput
            style={styles.input}
            placeholder="municipality"
            onChangeText={setMunicipality}
          />
          <TextInput
            style={styles.input}
            placeholder="latitude"
            onChangeText={setLatitude}
          />
          <TextInput
            style={styles.input}
            placeholder="longitude"
            onChangeText={setLongitude}
          />
          <TextButton
            title="Abort creation a new brigade"
            align={"center"}
            onPress={() => setIsCreatingBrigade(false)}
          />
        </>
      ) : !!brigade ? (
        <>
          <Text style={styles.label}>Fire brigade</Text>
          <View style={[styles.input, styles.brigadeSelected]}>
            <Text>
              {brigade.name} ({brigade.province}, {brigade.municipality})
            </Text>
            <Pressable onPress={() => setBrigade(null)}>
              <AntDesign name="closecircleo" size={24} color="#2196F3" />
            </Pressable>
          </View>
        </>
      ) : loading ? (
        <ActivityIndicator size="large" />
      ) : !!brigades && brigades.length ? (
        <>
          <Text style={styles.label}>
            Choose one of the existing fire brigade:
          </Text>
          <FlatList
            style={styles.brigades}
            data={brigades}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <Pressable style={styles.input} onPress={() => setBrigade(item)}>
                <Text style={styles.brigadeName}>
                  {item.name} ({item.province}, {item.municipality})
                </Text>
              </Pressable>
            )}
          />
          <Text>or</Text>
          <TextButton
            title="Create a new one"
            align={"center"}
            onPress={() => setIsCreatingBrigade(true)}
          />
        </>
      ) : !!searchBrigade && !!brigades && !brigades.length ? (
        <>
          <Text style={styles.nothing}>Nothing found</Text>
          <TextButton
            title="Create a new fire brigade"
            align={"right"}
            onPress={() => setIsCreatingBrigade(true)}
          />
        </>
      ) : null}

      {showSaveButton && isFormValid && (
        <TextButton
          loading={isSaving}
          title={saveButton}
          disabled={!isFormValid}
          onPress={handleSave}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: contentStyle,
  input: { ...inputStyle, marginVertical: 8 },
  label: labelStyle,
  title: titleStyle,
  brigades: {
    flexGrow: 0,
  },
  nothing: {
    marginBottom: 15,
  },
  brigadeSelected: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  brigadeName: {
    color: "#2196F3",
  },
});

export default UserBrigadeForm;
