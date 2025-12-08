import axios from "axios";
import { useAuthStore } from "../store/authStore";

const API_BASE_URL = "http://localhost:4000/api"; // ⬅️ change to your backend base URL

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

// Attach access token on each request
axiosClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401, try refresh once
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const { refreshToken, setTokens, logout } = useAuthStore.getState();

      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        } = refreshResponse.data;

        setTokens({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosClient(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
