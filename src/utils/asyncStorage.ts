import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (
  key: string,
  value: string,
  isJson?: boolean
) => {
  try {
    if (isJson) {
      value = JSON.stringify(value);
    }
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(error);
  }
};

export const getData = async (key: string, isJson?: boolean) => {
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
