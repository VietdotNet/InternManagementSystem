import axiosClient from "./api";

export const getCurrentUser = async () => {
  const res = await axiosClient.get("/auth/me");
  return res.data;
};