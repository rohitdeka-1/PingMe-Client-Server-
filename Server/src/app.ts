import dotenv from "dotenv"
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(express.json(),
)
app.use(express.urlencoded({
    extended:true
}))
app.use(cookieParser());

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



export default app;