import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Chat from "../models/chat.model";

export const initSocket = (io: Server) => {
  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("No token provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as jwt.JwtPayload;
      socket.data.userId = decoded.userId; // Store userId in socket
      next();
    } catch (err) {
      console.error("Socket authentication failed:", err);
      next(new Error("Authentication error"));
    }
  });

  // Handle socket connections
  io.on("connection", (socket) => {
    const userId = socket.data.userId;

    if (!userId) {
      console.error("User ID not found. Disconnecting...");
      socket.disconnect();
      return;
    }

    // Join the user to their specific room
    socket.join(userId);
    console.log(`User connected: ${userId}, Socket ID: ${socket.id}`);

    // Listen for "send-message" events
    socket.on("send-message", async ({ to, content }) => {
      const message = {
        senderId: userId,
        receiverId: to,
        content,
        timestamp: new Date(),
      };

      // Emit the message to the recipient
      io.to(to).emit("receive-message", message);

      // Save the message to the database
      try {
        const chat = await Chat.findOneAndUpdate(
          { participants: { $all: [userId, to] } },
          { $push: { messages: message } },
          { new: true, upsert: true }
        );
        console.log("Message saved to database:", chat);
      } catch (err) {
        console.error("Error saving message to database:", err);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
    });
  });
};