import { instance } from "@/config/api";

export const getProfile = async () => {
  try {
    const response = await instance.get("api/user/profile");
    return response.data;
  } catch (e) {
    throw e;
  }
};
