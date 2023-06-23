import { API_URL } from "@env";

const api = async (path, method = "GET", data) => {
  try {
    const response = await fetch(API_URL + path, {
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

export const get = async (path) => api(path);
export const post = async (path, data) => api(path, "POST", data);
