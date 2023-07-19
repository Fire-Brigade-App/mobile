import { Status } from "../constants/status";
import { put } from "./api";

export const updateStatus = async (
  userUid: string,
  brigadeId: string,
  status: Status
) => {
  const data = {
    brigadesIds: [brigadeId],
    data: {
      status,
    },
  };
  try {
    await put(`/users/${userUid}`, data);
  } catch (error) {
    console.error(error);
  }
};
