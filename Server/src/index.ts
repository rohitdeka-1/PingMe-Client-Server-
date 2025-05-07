import { app,httpServer } from "./app";
import connectDB from "./database/db";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT;

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Connected on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error starting Server", err);
  });
