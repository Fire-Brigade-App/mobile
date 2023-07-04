module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          path: ".env",
          safe: false,
          allowUndefined: true,
        },
      ],
      [require.resolve("expo-router/babel")],
    ],
  };
};
