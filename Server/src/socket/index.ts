import type { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Chat from "../models/chat.model";
import { Types } from "mongoose";

// Store online users with additional info
const onlineUsers = new Map<string, { socketId: string, lastActive: Date }>();

export const initSocket = (io: Server) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token provided"));

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as jwt.JwtPayload;
      socket.data.userId = decoded.userId;
      next();
    } catch (err) {
      console.error("Socket authentication failed:", err);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;
    if (!userId) {
      console.error("User ID not found. Disconnecting...");
      return socket.disconnect();
    }

    // Add user to online list with timestamp
    onlineUsers.set(userId, {
      socketId: socket.id,
      lastActive: new Date()
    });
    
    // Notify others
    socket.broadcast.emit("user-online", userId);
    console.log(`User connected: ${userId}`);

    // Heartbeat to track active connections
    const heartbeatInterval = setInterval(() => {
      onlineUsers.set(userId, {
        socketId: socket.id,
        lastActive: new Date()
      });
    }, 30000); // Update every 30 seconds

    // Message handling
    socket.on("send-message", async ({ to, content }, callback) => {
      try {
        const messageData = {
          senderId: new Types.ObjectId(userId),
          receiverId: new Types.ObjectId(to),
          content,
          timestamp: new Date(),
        };

        let chat = await Chat.findOne({ participants: { $all: [userId, to] } });
        if (!chat) {
          chat = new Chat({ participants: [userId, to], messages: [] });
        }

        chat.messages.push(messageData);
        await chat.save();

        const savedMessage = chat.messages[chat.messages.length - 1];
        io.to(to).emit("receive-message", {
          ...messageData,
          _id: savedMessage._id,
          senderId: { _id: userId },
        });

        callback?.({ success: true, messageId: savedMessage._id });
      } catch (err) {
        console.error("Error processing message:", err);
        callback?.({ success: false, error: "Failed to process message" });
      }
    });

    // Online users list
    socket.on("get-online-status", (targetUserId, callback) => {
      const isOnline = onlineUsers.has(targetUserId);
      callback(isOnline);
    });

    // Cleanup on disconnect
    socket.on("disconnect", () => {
      clearInterval(heartbeatInterval);
      onlineUsers.delete(userId);
      socket.broadcast.emit("user-offline", userId);
      console.log(`User disconnected: ${userId}`);
    });
  });
};

export const isUserOnline = (userId: string) => {
  return onlineUsers.has(userId);
};