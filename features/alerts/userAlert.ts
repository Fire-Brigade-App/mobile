import { useEffect, useState } from "react";
import { useAuth } from "../authentication/auth";
import firestore from "@react-native-firebase/firestore";
import { IAlert } from "./Alerts";
import { useAlerts } from "./userAlerts";

export const useAlert = (alertId: string) => {
  const { alerts } = useAlerts();
  const [alert, setAlert] = useState<IAlert>(null);

  const addedDate = alert?.added?.toDate().toLocaleDateString();
  const addedTime = alert?.added?.toDate().toLocaleTimeString();
  const type = alert?.type.toUpperCase();
  const address = alert?.address;
  const description = alert?.description;
  const vehicles = alert?.vehicles.map((vehicle) => vehicle).join(", ");
  const source = alert?.source;

  useEffect(() => {
    const alert = alerts.find((alert) => alert.id === alertId);
    if (alert) setAlert(alert);
  }, [alerts, alertId]);

  return { addedDate, addedTime, type, address, description, vehicles, source };
};
