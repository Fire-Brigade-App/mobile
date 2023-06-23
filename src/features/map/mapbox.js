import Mapbox from "@rnmapbox/maps";
import { MAPBOX_TOKEN } from "@env";

export const configMapbox = () => {
  Mapbox.setWellKnownTileServer("Mapbox");
  Mapbox.setAccessToken(MAPBOX_TOKEN);
};
