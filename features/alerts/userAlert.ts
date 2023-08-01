import { useEffect, useState } from "react";
import { useAuth } from "../authentication/auth";
import firestore from "@react-native-firebase/firestore";
import { IAlert } from "./Alerts";
import { useAlerts } from "./userAlerts";
import { BrigadeStatus } from "../../constants/BrigadeStatus";

export const useAlert = (alertId: string) => {
  const { alerts } = useAlerts();
  const [alert, setAlert] = useState<IAlert>(null);
  const { brigadeId } = useAuth();

  const addedDate = alert?.added?.toDate().toLocaleDateString();
  const addedTime = alert?.added?.toDate().toLocaleTimeString();
  const added = alert?.added;
  const completed = alert?.completed;
  const type = alert?.type;
  const address = alert?.address;
  const description = alert?.description;
  const vehicles = alert?.vehicles;
  const source = alert?.source;
  const author = alert?.author;

  useEffect(() => {
    const alert = alerts.find((alert) => alert.id === alertId);
    if (alert) setAlert(alert);
  }, [alerts, alertId]);

  const updateAlert = async (data: Partial<IAlert>) => {
    if (!completed && data.completed) {
      const notCompletedAlerts = alerts.filter((alert) => !alert.completed);
      if (notCompletedAlerts.length === 1) {
        try {
          await firestore().collection("brigades").doc(brigadeId).update({
            status: BrigadeStatus.STANDBY,
          });
        } catch (error) {
          console.error(error);
        }
      }
    }

    try {
      await firestore()
        .collection("brigades")
        .doc(brigadeId)
        .collection("alerts")
        .doc(alertId)
        .update(data);
    } catch (error) {
      console.error(error);
    }

    //
  };

  return {
    added,
    addedDate,
    addedTime,
    completed,
    type,
    address,
    description,
    vehicles,
    source,
    author,
    updateAlert,
  };
};
