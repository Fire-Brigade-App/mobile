import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import updateLocation from "../api/updateLocation";
import { getLocation } from "./location";

export const BACKGROUND_FETCH_TASK = "background-fetch";

/** Define the task by providing a name and the function that should be executed
 * Note: This needs to be called in the global scope (e.g outside of your React components)
 * @link https://docs.expo.dev/versions/latest/sdk/background-fetch/#usage
 */
export const defineBackgroundFetchTask = async () => {
  TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    const location = await getLocation();
    await updateLocation({ ...location, source: BACKGROUND_FETCH_TASK });

    // Be sure to return the successful result type!
    return BackgroundFetch.BackgroundFetchResult.NewData;
  });
};

/** Register the task at some point in your app by providing the same name,
 * and some configuration options for how the background fetch should behave
 * Note: This does NOT need to be in the global scope and CAN be used in your React components!
 * @link https://docs.expo.dev/versions/latest/sdk/background-fetch/#usage
 */
export const registerBackgroundFetchAsync = async () => {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 1, // 10 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
};

/** (Optional) Unregister tasks by specifying the task name
 * This will cancel any future background fetch calls that match the given name
 * Note: This does NOT need to be in the global scope and CAN be used in your React components!
 * @link https://docs.expo.dev/versions/latest/sdk/background-fetch/#usage
 */
export const unregisterBackgroundFetchAsync = async () => {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
};

export const isBackgroundFetchTaskRegistered = async () => {
  const status = await BackgroundFetch.getStatusAsync();
  const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(
    BACKGROUND_FETCH_TASK
  );
  return (
    status === BackgroundFetch.BackgroundFetchStatus.Available &&
    isTaskRegistered
  );
};
