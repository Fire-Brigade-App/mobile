import { post } from "./api";

export default async function saveToken(token) {
  console.log("Init the token saving:", token);
  return post("/", { token });
}