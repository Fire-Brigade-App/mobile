import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRouter, useSegments } from "expo-router";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { UserData } from "../../data/UserData";
import { BrigadePermissions } from "../../constants/brigadePermissions";
import { storeData } from "../../utils/asyncStorage";
import { LocalStorage } from "../../constants/localStorage";

const getUserData = async (user: FirebaseAuthTypes.User) => {
  const userData = await firestore().collection("users").doc(user.uid).get();
  if (userData.exists) {
    const data = userData.data();
    return data;
  }
  return null;
};

const getBrigadeData = async (brigadeId: string) => {
  const brigadeData = await firestore()
    .collection("brigades")
    .doc(brigadeId)
    .get();
  if (brigadeData.exists) {
    const data = brigadeData.data();
    return data;
  }
  return null;
};

export const signOut = async () => {
  return auth()
    .signOut()
    .then(() => console.log("User signed out!"));
};

interface IAuthContext {
  initializing: boolean;
  user: FirebaseAuthTypes.User;
  userData: UserData;
  brigadeId: string;
}

const AuthContext = createContext<IAuthContext>(null);

// This hook can be used to access the user info.
export const useAuth = () => {
  return useContext(AuthContext);
};

// This hook will protect the route access based on user authentication.
const useProtectedRoute = (
  user: FirebaseAuthTypes.User,
  userData: UserData
) => {
  const segments = useSegments();
  const router = useRouter();
  const timer = useRef(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      const inAuthGroup = segments[0] === "(auth)";

      if (
        // If the user is not signed in and the initial segment is not anything in the auth group.
        !user &&
        !inAuthGroup
      ) {
        // Redirect to the sign-in page.
        router.replace("/sign-in");
      } else if (user && (!userData?.firstName || !userData?.lastName)) {
        router.replace("/fill-name");
      } else if (user && !userData?.brigades) {
        router.replace("/choose-brigade");
      } else if (user && inAuthGroup) {
        // Redirect away from the sign-in page.
        router.replace("/home");
      }
    }, 1000);

    return () => clearTimeout(timer.current);
  }, [user, userData]);
};

export const useAdmin = () => {
  const { user, brigadeId } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    let didCancel = false;

    const fetchBrigadeData = async (brigadeId: string) => {
      const brigadeData = await getBrigadeData(brigadeId);
      const permissions = brigadeData.permissions;
      const isAdmin =
        user && permissions[user.uid]?.includes(BrigadePermissions.ADMIN);
      if (!didCancel) setIsAdmin(isAdmin);
    };

    brigadeId && fetchBrigadeData(brigadeId);

    return () => {
      didCancel = true;
    };
  }, [user, brigadeId]);

  return { isAdmin };
};

export const AuthProvider = (props) => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User>(null);
  const [userData, setUserData] = useState<UserData>(null);
  const [brigadeId, setBrigadeId] = useState<string>(null);

  useProtectedRoute(user, userData);

  // Handle user state changes
  const onAuthStateChanged = (user: FirebaseAuthTypes.User) => {
    setUser(user);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Listen for user data changes
  useEffect(() => {
    let subscriber: () => void;

    if (user) {
      subscriber = firestore()
        .collection("users")
        .doc(user.uid)
        .onSnapshot((documentSnapshot) => {
          const useData = documentSnapshot.data() as UserData;
          console.log("User data: ", useData);
          if (useData) {
            setUserData(useData);
            // Stop listening for updates after initial update user data
            // subscriber();
          }
        });
    }

    // Stop listening for updates when no longer required
    return () => subscriber && subscriber();
  }, [user]);

  // Fetching signed in user data
  useEffect(() => {
    let didCancel = false;

    const storeUserUid = async (user: FirebaseAuthTypes.User) => {
      await storeData(LocalStorage.USER_UID, user.uid);
    };

    const fetchUserData = async (user: FirebaseAuthTypes.User) => {
      const userData = await getUserData(user);
      if (!didCancel) setUserData(userData as UserData);
      setInitializing(false);
    };

    if (user) {
      storeUserUid(user);
      fetchUserData(user);
    }

    return () => {
      didCancel = true;
    };
  }, [user]);

  useEffect(() => {
    const brigadeId = userData?.brigades
      ? Object.keys(userData?.brigades)[0]
      : null;
    setBrigadeId(brigadeId);
  }, [userData?.brigades]);

  return (
    <AuthContext.Provider value={{ initializing, user, userData, brigadeId }}>
      {props.children}
    </AuthContext.Provider>
  );
};
