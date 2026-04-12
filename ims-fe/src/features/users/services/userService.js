import axiosClient from "@/shared/utils/api"

export const createInterns = async (data) => {
    const response = await axiosClient.post("/user/interns", data);
    return response.data;
};

export const createMentors = async (data) => {
    const response = await axiosClient.post("/user/mentors", data);
    return response.data;
}

export const getAllMentors = async () => {
    const response = await axiosClient.get("/user/mentors");
    return response.data;
};