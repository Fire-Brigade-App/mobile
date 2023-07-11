import { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { useAuth } from "../authentication/auth";
import { Brigade } from "../../data/Brigade";

export const useBrigade = () => {
  const { brigadeId } = useAuth();
  const [brigade, setBrigade] = useState<Brigade>();

  useEffect(() => {
    const subscriber = firestore()
      .collection("brigades")
      .doc(brigadeId)
      .onSnapshot((documentSnapshot) => {
        const brigadeData = documentSnapshot.data() as Brigade;
        setBrigade(brigadeData);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [brigadeId]);

  return { brigade };
};