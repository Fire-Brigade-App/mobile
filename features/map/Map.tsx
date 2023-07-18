import React, { FC, useEffect, useRef, useState } from "react";
import Mapbox, {
  Camera,
  MapView,
  MarkerView,
  UserLocation,
  UserTrackingMode,
} from "@rnmapbox/maps";
import { Pressable, StyleSheet, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { configMapbox } from "./mapbox";
import { useBrigade } from "../status/useBrigade";

interface IMap {
  isUserTracked: boolean;
}

configMapbox();

export const Map: FC<IMap> = ({ isUserTracked }) => {
  const cameraRef = useRef<Camera>(null);
  const [followUserLocation, setFollowUserLocation] = useState(true);
  const [userLocation, setUserLocation] = useState([0, 0]);
  const [brigadeCoordinates, setBrigadeCoordinates] = useState(null);
  const { brigade } = useBrigade();

  const handleDidFinishRenderingMapFully = () => {
    const centerCoordinate = userLocation[0]
      ? userLocation
      : brigadeCoordinates;
    cameraRef.current?.setCamera({
      animationDuration: 0,
      centerCoordinate,
      zoomLevel: 13,
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
      centerCoordinate: userLocation,
      animationDuration: 500,
    });
    setFollowUserLocation(true);
  };

  useEffect(() => {
    if (brigade?.location) {
      const { longitude, latitude } = brigade?.location;
      setBrigadeCoordinates([longitude, latitude]);
    }
  }, [brigade]);

  return (
    <>
      <MapView
        style={styles.map}
        logoEnabled={false}
        attributionEnabled={false}
        zoomEnabled={true}
        compassEnabled={true}
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
            <Pressable style={styles.markerBox}>
              <Text style={styles.markerText}>OSP</Text>
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
    padding: 4,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "red",
  },
  markerBoxSelected: {
    padding: 12,
  },
  markerText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
});
