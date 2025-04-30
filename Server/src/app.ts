import dotenv from "dotenv"
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}))

import router from "./routes/index.route";
app.use("/api/v1",router);



export default app;