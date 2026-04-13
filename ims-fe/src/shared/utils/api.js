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

     if (
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/refresh-token") ||
      originalRequest.url.includes("/auth/me")
    ) {
      return Promise.reject(err);
    }

    // ❗ chỉ xử lý 401
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // ❗ chỉ refresh khi đã login (có cookie)
        if (!document.cookie) {
          return Promise.reject(err);
        }

        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = axiosClient.post("/auth/refresh-token");
        }

        await refreshPromise;

        isRefreshing = false;
        refreshPromise = null;

        return axiosClient(originalRequest);

      } catch (refreshError) {
        isRefreshing = false;
        refreshPromise = null;

        console.log("Session expired");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default axiosClient;