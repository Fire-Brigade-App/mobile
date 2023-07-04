import Mapbox from "@rnmapbox/maps";

export const configMapbox = () => {
  Mapbox.setWellKnownTileServer("Mapbox");
  Mapbox.setAccessToken(process.env.MAPBOX_TOKEN);
};
