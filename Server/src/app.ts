import dotenv from "dotenv"
dotenv.config();
import express from "express";
import cors from "cors";
import { createServer } from "http";
import {Server} from "socket.io";

const app = express();

app.use(express.json(),
)
app.use(express.urlencoded({
    extended:true
}))

app.set("trust proxy", 1);

const corsOptions = {
    origin: ["http://localhost:5173", "https://pingme-delta.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  };
  
  app.use(cors(corsOptions));
  app.options("*", cors({
    origin: [
      "http://localhost:5173",
      "https://pingme-delta.vercel.app"
    ],
    credentials: true,
  }));
  

import router from "./routes/index.route";
app.use("/api/v1",router);


const httpServer = createServer(app);

const io = new Server(httpServer,{
  cors: corsOptions,
})

io.on("connection", (socket) => {
  console.log(`New User Connected: ${socket.id}`);

  socket.on("joinRoom", (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    } else {
      console.error("User ID is null or undefined in joinRoom event");
    }
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});


export {app,httpServer,io};