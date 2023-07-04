import { useEffect, useState } from "react";
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

export const useLogin = () => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User>();
  const [userData, setUserData] = useState(null);

  // Handle user state changes
  const onAuthStateChanged = (user: FirebaseAuthTypes.User) => {
    setUser(user);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    let didCancel = false;

    const fetchUserData = async (user: FirebaseAuthTypes.User) => {
      if (!initializing) setInitializing(true);
      const userData = await getUserData(user);
      if (!didCancel) setUserData(userData);
    };

    user && fetchUserData(user);

    if (initializing) setInitializing(false);

    return () => {
      didCancel = true;
    };
  }, [user]);

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
            subscriber();
          }
        });
    }

    // Stop listening for updates when no longer required
    return () => subscriber && subscriber();
  }, [user]);

  return { initializing, user, userData };
};
