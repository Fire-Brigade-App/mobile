import React, { FC } from "react";
import Mapbox from "@rnmapbox/maps";
import { Pressable, StyleSheet, Text } from "react-native";
import { configMapbox } from "./mapbox";

interface IMap {
  isUserTracked: boolean;
}

configMapbox();

export const Map: FC<IMap> = ({ isUserTracked }) => {
  return (
    <Mapbox.MapView
      style={styles.map}
      logoEnabled={false}
      attributionEnabled={false}
      compassEnabled={true}
      compassViewPosition={3}
    >
      {isUserTracked && (
        <>
          <Mapbox.UserLocation requestsAlwaysUse={true} minDisplacement={10} />
          <Mapbox.Camera followUserLocation={true} followZoomLevel={13} />
        </>
      )}
      <Mapbox.MarkerView
        coordinate={[22.4612238, 51.2311859]}
        allowOverlap={true}
      >
        <Pressable
          style={[styles.markerBox, { backgroundColor: "red", padding: 4 }]}
        >
          <Text style={styles.markerText}>OSP</Text>
        </Pressable>
      </Mapbox.MarkerView>
    </Mapbox.MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  markerBox: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    padding: 4,
    borderWidth: 2,
    borderColor: "white",
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
