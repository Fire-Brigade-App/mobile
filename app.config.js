export default {
  expo: {
    name: "fire-brigade",
    slug: "fire-brigade",
    version: "0.1.0",
    assetBundlePatterns: [
      "**/*"
    ],
    extra: {
      eas: {
        "projectId": "85590386-1e78-4f58-8476-35c071c2f9de"
      }
    },
    plugins: [
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location.",
          "isIosBackgroundLocationEnabled": true,
          "isAndroidBackgroundLocationEnabled": true
        }
      ],
      [
        "@rnmapbox/maps",
        {
          "RNMapboxMapsImpl": "maplibre"
        }
      ]
    ],
    android: {
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.ACCESS_BACKGROUND_LOCATION"
      ],
      package: "com.maksymilianorg.firebrigade"
    }
  },
  name: "fire-brigade"
}
