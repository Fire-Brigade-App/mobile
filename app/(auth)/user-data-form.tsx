import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { useAuth } from "../../features/authentication/auth";
import { Loader } from "../../features/loader/Loader";
import { useFcmToken } from "../../utils/notifications";
import { Status } from "../../features/status/UserStatus";

interface Brigade {
  name: string;
  country: string;
  province: string;
  municipality: string;
  location: FirebaseFirestoreTypes.GeoPoint;
  roles: Record<string, Role[]>;
  status: BrigadeStatus;
  alerts: string[];
}

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

interface NewBrigadeData {
  userUid: string;
  brigadeName: string;
  country: string;
  province: string;
  municipality: string;
  latitude: number;
  longitude: number;
}

enum Role {
  ADMIN = "admin",
}

enum BrigadeStatus {
  INACTIVE = "inactive",
  STANDBY = "standby",
  ALERT = "alert",
}

const createNewBrigade = async (brigadeData: NewBrigadeData) => {
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
    roles: { [userUid]: [Role.ADMIN] },
    status: BrigadeStatus.STANDBY,
    alerts: [],
  };

  const brigadeDocRef = await firestore()
    .collection("brigades")
    .add(newBrigade);

  return brigadeDocRef;
};

interface UserDataToSave {
  userUid: string;
  fcmToken: string;
  firstName: string;
  lastName: string;
  brigade: BrigadeWithUid;
}

export interface User {
  fcmToken: string;
  firstName: string;
  lastName: string;
  brigades: {
    [brigadeId: string]: {
      status: Status;
      time: string;
      roles: UserRole[];
    };
  };
  location: FirebaseFirestoreTypes.GeoPoint;
  updated: FirebaseFirestoreTypes.Timestamp;
}

export enum UserRole {
  FIREFIGHTER = "firefighter",
  DRIVER = "driver",
  COMMANDER = "commander",
  PARAMEDIC = "paramedic",
}

const saveUserData = async (
  userDataToSave: UserDataToSave,
  newBrigadeData?: NewBrigadeData
) => {
  let newBrigadeId = null;

  if (newBrigadeData) {
    const brigadeDocRef = await createNewBrigade(newBrigadeData);
    newBrigadeId = brigadeDocRef.id;
  }

  const { userUid, fcmToken, firstName, lastName, brigade } = userDataToSave;

  const brigadeId = newBrigadeId || brigade.uid;

  const newUserData: User = {
    fcmToken,
    firstName,
    lastName,
    brigades: {
      [brigadeId]: {
        status: Status.OFFLINE,
        time: "0:0:0",
        roles: [UserRole.FIREFIGHTER],
      },
    },
    location: new firestore.GeoPoint(0, 0),
    updated: firestore.Timestamp.fromDate(new Date()),
  };

  const brigadeDocRef = await firestore()
    .collection("users")
    .doc(userUid)
    .set(newUserData);

  return brigadeDocRef;
};

const UserDataForm: FC = () => {
  const { initializing, user } = useAuth();
  const userUid = user.uid;
  const { fcmToken } = useFcmToken();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
    !!firstName &&
    !!lastName &&
    (brigade ||
      (isCreatingBrigade &&
        searchBrigade &&
        country &&
        province &&
        municipality &&
        latitude &&
        longitude));

  const handleNext = async () => {
    setIsSaving(true);

    const userDataToSave = {
      userUid,
      fcmToken,
      firstName,
      lastName,
      brigade,
    };

    const newBrigadeData = isCreatingBrigade
      ? {
          userUid,
          brigadeName: searchBrigade,
          country,
          province,
          municipality,
          latitude,
          longitude,
        }
      : undefined;

    await saveUserData(userDataToSave, newBrigadeData);

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
    return <Loader />;
  }

  return (
    <View style={styles.form}>
      <Text style={styles.title}>
        Fill out this form {firstName} {lastName}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="first name"
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="last name"
        onChangeText={setLastName}
      />

      {/* Show text input for searcing brigades if none is selected */}
      {!brigade && (
        <TextInput
          style={styles.input}
          placeholder="fire brigade"
          value={searchBrigade}
          onChangeText={setSearchBrigade}
        />
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
          <Button
            onPress={() => setIsCreatingBrigade(false)}
            title="Abort creation a new brigade"
          />
        </>
      ) : !!brigade ? (
        <View style={styles.brigadeSelected}>
          <Text>
            {brigade.name} ({brigade.province}, {brigade.municipality})
          </Text>
          <Pressable onPress={() => setBrigade(null)}>
            <Text>X</Text>
          </Pressable>
        </View>
      ) : loading ? (
        <ActivityIndicator size="large" />
      ) : !!brigades && brigades.length ? (
        <>
          <Text>Choose one of the fire brigade:</Text>
          <FlatList
            style={styles.brigades}
            data={brigades}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <Pressable
                style={styles.brigadeItem}
                onPress={() => setBrigade(item)}
              >
                <Text>
                  {item.name} ({item.province}, {item.municipality})
                </Text>
              </Pressable>
            )}
          />
          <Text>or</Text>
          <Button
            onPress={() => setIsCreatingBrigade(true)}
            title="Create a new one"
          />
        </>
      ) : !!searchBrigade && !!brigades && !brigades.length ? (
        <>
          <Text style={styles.nothing}>Nothing found</Text>
          <Button
            onPress={() => setIsCreatingBrigade(true)}
            title="Create a new fire brigade"
          />
        </>
      ) : null}

      {isSaving ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Next" disabled={!isFormValid} onPress={handleNext} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    padding: 20,
  },
  title: {
    marginBottom: 15,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    backgroundColor: "#EEEEEE",
    padding: 10,
    marginBottom: 15,
    borderRadius: 3,
  },
  brigades: {
    flexGrow: 0,
  },
  nothing: {
    marginBottom: 15,
  },
  brigadeSelected: {
    flexDirection: "row",
  },
  brigadeItem: {
    borderColor: "#DDDDDD",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginBottom: 5,
  },
});

export default UserDataForm;
