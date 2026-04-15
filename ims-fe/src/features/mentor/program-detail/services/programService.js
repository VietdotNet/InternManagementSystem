import  axiosClient from "@/shared/utils/api";

export const getDetailProgram = async (id) => {
  try {
    const res = await axiosClient.get(`/programTraining/details/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};