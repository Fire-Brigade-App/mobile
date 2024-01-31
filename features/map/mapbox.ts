import Mapbox from "@rnmapbox/maps";

export const configMapbox = () => {
  Mapbox.setAccessToken(process.env.MAPBOX_TOKEN);
};
