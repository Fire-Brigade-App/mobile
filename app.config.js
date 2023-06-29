import "dotenv/config";

export default {
  expo: {
    name: "fire-brigade",
    slug: "fire-brigade",
    version: "0.1.0",
    assetBundlePatterns: ["**/*"],
    extra: {
      eas: {
        projectId: process.env.EAS_PROJECT_ID,
      },
    },
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow $(PRODUCT_NAME) to use your location.",
          isIosBackgroundLocationEnabled: true,
          isAndroidBackgroundLocationEnabled: true,
        },
      ],
      [
        "@rnmapbox/maps",
        {
          RNMapboxMapsImpl: "maplibre",
        },
      ],
      ["@react-native-google-signin/google-signin"],
    ],
    android: {
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
      intentFilters: [
        {
          action: "VIEW",
          data: [
            {
              scheme: process.env.DYNAMIC_LINK_SCHEME || "https",
              host: process.env.DYNAMIC_LINK_DOMAIN,
              pathPrefix: "/",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
          autoVerify: true, // required to work on newer android versions
        },
      ],
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.ACCESS_BACKGROUND_LOCATION",
      ],
      package: process.env.PACKAGE_NAME,
    },
    ios: {
      associatedDomains: [
        `applinks:${process.env.DYNAMIC_LINK_SCHEME}://${process.env.DYNAMIC_LINK_DOMAIN}`,
      ],
    },
  },
  name: "fire-brigade",
};
