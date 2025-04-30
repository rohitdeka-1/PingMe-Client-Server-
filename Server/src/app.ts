import dotenv from "dotenv"
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
app.use(cookieParser());

import router from "./routes/index.route";
app.use("/api/v1",router);



export default app;