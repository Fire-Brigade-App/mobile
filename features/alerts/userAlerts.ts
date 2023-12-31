import { useEffect, useState } from "react";
import { useAuth } from "../authentication/auth";
import firestore from "@react-native-firebase/firestore";
import { AlertWithId } from "./Alerts";
import { useBrigade } from "../status/useBrigade";

export const useAlerts = () => {
  const { brigadeId } = useAuth();
  const [alerts, setAlerts] = useState<AlertWithId[]>([]);
  const { isActiveAlert } = useBrigade();
  const [currentAlert, setCurrentAlert] = useState<AlertWithId>(null);

  useEffect(() => {
    const subscriber = firestore()
      .collection("brigades")
      .doc(brigadeId)
      .collection("alerts")
      .orderBy("added", "desc")
      .onSnapshot((documentSnapshot) => {
        if (!documentSnapshot.empty) {
          const alerts = documentSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as AlertWithId[];
          setAlerts(alerts);
        }
      });

    return () => subscriber();
  }, [brigadeId]);

  useEffect(() => {
    if (isActiveAlert && alerts.length) {
      const lastAlert = alerts[0];
      setCurrentAlert(lastAlert);
    } else {
      setCurrentAlert(null);
    }
  }, [isActiveAlert, alerts]);

  return { alerts, currentAlert };
};
