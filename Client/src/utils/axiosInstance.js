import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URI}/api/v1`, // Base URL for all requests
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

export default axiosInstance;   