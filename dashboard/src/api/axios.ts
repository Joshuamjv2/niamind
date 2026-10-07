import axios from "axios";
import { storage } from "../utils/storage";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Attach token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = storage.get("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Global auth handling
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      storage.remove("user");
      storage.remove("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);