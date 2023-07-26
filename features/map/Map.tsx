import React, { FC, useEffect, useRef, useState } from "react";
import Mapbox, {
  Camera,
  MapView,
  MarkerView,
  UserLocation,
} from "@rnmapbox/maps";
import { Pressable, StyleSheet, Text } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { configMapbox } from "./mapbox";
import { useBrigade } from "../status/useBrigade";
import { useAlerts } from "../alerts/userAlerts";

interface IMap {
  isUserTracked: boolean;
}

configMapbox();

export const Map: FC<IMap> = ({ isUserTracked }) => {
  const cameraRef = useRef<Camera>(null);
  const [followUserLocation, setFollowUserLocation] = useState(true);
  const [userLocation, setUserLocation] = useState([0, 0]);
  const [brigadeCoordinates, setBrigadeCoordinates] = useState(null);
  const [alertCoordinates, setAlertCoordinates] = useState(null);
  const { brigade } = useBrigade();
  const { currentAlert } = useAlerts();

  const handleDidFinishRenderingMapFully = () => {
    const centerCoordinate = userLocation[0]
      ? userLocation
      : alertCoordinates
      ? alertCoordinates
      : brigadeCoordinates;
    cameraRef.current?.setCamera({
      animationDuration: 0,
      centerCoordinate,
      zoomLevel: 12,
    });
  };

  const handleUserLocationUpdate = ({ coords }: Mapbox.Location) => {
    setUserLocation([coords.longitude, coords.latitude]);
    if (followUserLocation) {
      cameraRef.current?.setCamera({
        centerCoordinate: [coords.longitude, coords.latitude],
      });
    }
  };

  const handleTouchStart = () => {
    // Stop following user location on touch map
    setFollowUserLocation(false);
  };

  const centerOnUserLocation = () => {
    cameraRef.current?.setCamera({
      centerCoordinate: userLocation[0] ? userLocation : brigadeCoordinates,
      animationDuration: 500,
    });
    setFollowUserLocation(true);
  };

  useEffect(() => {
    if (brigade?.location) {
      const { longitude, latitude } = brigade.location;
      setBrigadeCoordinates([longitude, latitude]);
    }
  }, [brigade?.location]);

  useEffect(() => {
    if (currentAlert?.location) {
      const { longitude, latitude } = currentAlert.location;
      if (
        (alertCoordinates && longitude !== alertCoordinates[0]) ||
        (alertCoordinates && latitude !== alertCoordinates[1])
      ) {
        setAlertCoordinates([longitude, latitude]);
        setFollowUserLocation(false);
        cameraRef.current?.setCamera({
          centerCoordinate: [longitude, latitude],
          animationDuration: 500,
          zoomLevel: 12,
        });
      }
    } else {
      setAlertCoordinates(null);
    }
  }, [currentAlert?.location]);

  return (
    <>
      <MapView
        style={styles.map}
        logoEnabled={false}
        attributionEnabled={false}
        zoomEnabled={true}
        scaleBarEnabled={false}
        compassEnabled={true}
        compassFadeWhenNorth={true}
        compassViewPosition={2}
        onDidFinishRenderingMapFully={handleDidFinishRenderingMapFully}
        onTouchStart={handleTouchStart}
      >
        {isUserTracked && (
          <>
            <UserLocation
              requestsAlwaysUse={true}
              minDisplacement={10}
              onUpdate={handleUserLocationUpdate}
            />
          </>
        )}
        <Camera ref={cameraRef} zoomLevel={13} />
        {brigadeCoordinates && (
          <MarkerView coordinate={brigadeCoordinates} allowOverlap={true}>
            <Pressable style={[styles.markerBox, styles.markerBrigade]}>
              <Text style={styles.markerText}>OSP</Text>
            </Pressable>
          </MarkerView>
        )}
        {alertCoordinates && (
          <MarkerView coordinate={alertCoordinates} allowOverlap={true}>
            <Pressable style={[styles.markerBox, styles.markerAlert]}>
              <MaterialCommunityIcons name="fire" size={24} color="#000000" />
            </Pressable>
          </MarkerView>
        )}
      </MapView>
      <Pressable
        style={styles.followUserLocationButton}
        onPress={centerOnUserLocation}
      >
        <MaterialIcons
          name="my-location"
          size={26}
          style={styles.followUserLocationButtonIcon}
        />
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  followUserLocationButton: {
    width: 50,
    height: 50,
    backgroundColor: "#ffffff",
    position: "absolute",
    borderRadius: 40,
    justifyContent: "center",
    bottom: 10,
    right: 10,
    zIndex: 10,
  },
  followUserLocationButtonIcon: {
    textAlign: "center",
    color: "#777777",
  },
  markerBox: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    borderWidth: 2,
  },
  markerBrigade: {
    padding: 4,
    borderColor: "#FFFFFF",
    backgroundColor: "#DC143C",
  },
  markerText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  markerAlert: {
    padding: 0,
    backgroundColor: "#FFC302",
    borderColor: "white",
  },
});
