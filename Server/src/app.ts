import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket/index";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);

const corsOptions = {
  origin: ["http://localhost:5173", "https://pingme-delta.vercel.app"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

import router from "./routes/index.route";
app.use("/api/v1", router);

// Create HTTP & WebSocket server
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: corsOptions });

initSocket(io);

export { app, httpServer, io };
