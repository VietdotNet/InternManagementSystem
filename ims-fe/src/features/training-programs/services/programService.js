import axiosClient from "@/shared/utils/api"

export const createProgramTraining = async (data) => {
    const response = await axiosClient.post("/programTraining", data);
    return response.data;
};

export const getAllPrograms = async () => {
    const response = await axiosClient.get("/programTraining");
    return response.data;
};

export const getTracksByProgram = async (programId) => {
    const response = await axiosClient.get(`/programTraining/${programId}/tracks`);
    return response.data;
};
