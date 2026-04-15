import  axiosClient from "@/shared/utils/api";

export const getProgramsByMentor = async () => {
  try {
    const res = await axiosClient.get(`/programTraining/by-mentor`);
    return res.data;
  } catch (error) {
    throw error;
  }
};