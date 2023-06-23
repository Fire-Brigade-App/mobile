import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key, value, isJson) => {
  try {
    if (isJson) {
      value = JSON.stringify(value);
    }
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(error);
  }
};

export const getData = async (key, isJson) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value != null) {
      if (isJson) {
        return JSON.parse(value);
      }
      return value;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
  }
};
