import * as Network from "expo-network";

export const isInternetReachable = async () => {
  const networkState = await Network.getNetworkStateAsync();
  return networkState.isInternetReachable;
};
