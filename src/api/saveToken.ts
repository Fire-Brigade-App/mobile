import { post } from "./api";

export default async function saveToken(token: string) {
  console.log("Init the token saving:", token);
  return post("/", { token });
}
