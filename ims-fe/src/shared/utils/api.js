import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://localhost:7201/api",
  withCredentials: true
});

let isRefreshing = false;
let refreshPromise = null;

axiosClient.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url.includes("/auth/refresh-token") &&
      !originalRequest.url.includes("/auth/login")) {
      originalRequest._retry = true;

      try {
        // Nếu chưa refresh thì gọi
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = axiosClient.post("/auth/refresh-token");
        }

        // Các request khác sẽ chờ thằng này
        await refreshPromise;

        isRefreshing = false;
        refreshPromise = null;

        // retry request cũ
        return axiosClient(originalRequest);

      } catch (refreshError) {
        isRefreshing = false;
        refreshPromise = null;

        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default axiosClient;