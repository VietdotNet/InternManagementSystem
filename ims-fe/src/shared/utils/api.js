import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://localhost/api",
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
      originalRequest.url.includes("/auth/refresh-token") 
    ) {
      return Promise.reject(err);
    }

    // Xử lý 401
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Chỉ refresh khi đã login (có cookie)
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = axiosClient.post("/auth/refresh-token")
          .finally(() => {
              isRefreshing = false;
              refreshPromise = null;
            });
        }

        await refreshPromise;

        return axiosClient(originalRequest);

      } catch (refreshError) {

        console.log("Session expired");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export default axiosClient;