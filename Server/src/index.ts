import { app, httpServer, io } from "./app";
import connectDB from "./database/db";
import dotenv from "dotenv";
import { initSocket } from "./socket"; 
dotenv.config();

const PORT = process.env.PORT || 8800;

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Connected on port ${PORT}`);
      initSocket(io); // <-- initialize socket events
    });
  })
  .catch((err) => {
    console.log("Error starting Server", err);
  });
