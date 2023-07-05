import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRouter, useSegments } from "expo-router";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const getUserData = async (user: FirebaseAuthTypes.User) => {
  const userData = await firestore().collection("users").doc(user.uid).get();
  if (userData.exists) {
    const data = userData.data();
    return data;
  }
  return null;
};

export const signOut = async () => {
  return auth()
    .signOut()
    .then(() => console.log("User signed out!"));
};

const AuthContext = createContext(null);

// This hook can be used to access the user info.
export const useAuth = () => {
  return useContext(AuthContext);
};

// This hook will protect the route access based on user authentication.
const useProtectedRoute = (user, userData) => {
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
      } else if (user && !userData) {
        router.replace("/user-data-form");
      } else if (user && inAuthGroup) {
        // Redirect away from the sign-in page.
        router.replace("/home");
      }
    }, 200);

    return () => clearTimeout(timer.current);
  }, [user, userData, segments]);
};

export const AuthProvider = (props) => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User>();
  const [userData, setUserData] = useState(null);

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
          const useData = documentSnapshot.data();
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

    const fetchUserData = async (user: FirebaseAuthTypes.User) => {
      const userData = await getUserData(user);
      if (!didCancel) setUserData(userData);
      setInitializing(false);
    };

    user && fetchUserData(user);

    return () => {
      didCancel = true;
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ initializing, user, userData }}>
      {props.children}
    </AuthContext.Provider>
  );
};
