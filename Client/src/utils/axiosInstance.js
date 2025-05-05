import axios from "axios";
import { navigateToLogin } from "./navigateToLogin";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URI}/api/v1`,  
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      navigateToLogin();  
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;