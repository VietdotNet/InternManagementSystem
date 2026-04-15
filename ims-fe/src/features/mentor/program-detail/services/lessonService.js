import  axiosClient from "@/shared/utils/api";

//Service func: Login
export const createLesson = async (data) => {
  const response = await axiosClient.post("/lesson", data);
  return response.data;
};

// GET by trackId
export const getLessonsByTrack = async (trackId) => {
  const res = await axiosClient.get(`/lesson/track/${trackId}`);
  return res.data;
};

export const updateLesson = async (id, data) => {
  try {
    const res = await axiosClient.put(`/lesson/${id}`, data);
    return res.data;
  } catch (error) {
    if (error.response?.status === 409) {
      throw new Error("Dữ liệu đã bị thay đổi bởi người khác. Vui lòng reload!");
    }
    throw error;
  }
};

// DELETE
export const deleteLesson = async (id) => {
  const res = await axiosClient.delete(`/lesson/${id}`);
  return res.data;
};