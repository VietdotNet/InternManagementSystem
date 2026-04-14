import  axiosClient from "@/shared/utils/api";

//Service func: Login
export const login = async (data) => {
  const response = await axiosClient.post("/auth/login", data);
  return response.data;
};

//Service func: Logout
export const logout = async () => {
   await axiosClient.post("/auth/logout");
};