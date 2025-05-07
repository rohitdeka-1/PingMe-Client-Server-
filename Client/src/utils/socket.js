import { io } from "socket.io-client";

const socket = io("https://pingme-client-server.onrender.com");
export {socket};