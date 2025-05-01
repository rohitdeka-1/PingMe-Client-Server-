import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URI}/api/v1`, // Base URL for all requests
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;