import { isInternetReachable } from "../utils/network";

const api = async (path: string, method = "GET", data?: object) => {
  try {
    const isInternet = await isInternetReachable();
    if (!isInternet) {
      return;
    }

    const response = await fetch(process.env.API_URL + path, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    const jsonData = await response.json();
    console.log(`Response (${method} to ${path}): ${JSON.stringify(jsonData)}`);
  } catch (err) {
    console.error(err);
  }
};

export const get = async (path: string) => api(path);
export const post = async (path: string, data: object) =>
  api(path, "POST", data);
export const put = async (path: string, data: object) => api(path, "PUT", data);
