import {io} from "socket.io-client"

const token = localStorage.getItem("ACCESS_TOKEN");  
if (!token) {
  console.error("No token found");
}

const socket = io(`${import.meta.env.VITE_BACKEND_URI}`, {
  transports: ["websocket"],
  withCredentials: true,
  auth: {
    token,  
  },
});

export { socket };


