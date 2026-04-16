import  axiosClient from "@/shared/utils/api";
import { GoogleLogin } from "@react-oauth/google";

//Service func: Login
export const login = async (data) => {
  const response = await axiosClient.post("/auth/login", data);
  return response.data;
};

//Service func: Logout
export const logout = async () => {
   await axiosClient.post("/auth/logout");
};

export const loginWithGoogle = async (idToken) => {
  try {
    const response = await axiosClient.post("/auth/signIn-google", {
    idToken,
  });
  return response.data;
  } catch (err) {
      console.error("Google login error:", err);
      throw err;
 }
};