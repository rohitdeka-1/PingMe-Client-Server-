import type { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Chat from "../models/chat.model";
import { Types } from "mongoose";
import User from "../models/user.model";

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
      lastActive: new Date(),
    });

    // Notify others
    socket.broadcast.emit("user-online", userId);
    console.log(`User connected: ${userId}`);
    const emitRequestUpdate = async (userId: string) => {
      try {
        const user = await User.findById(userId);
        if (!user) return;
    
        const pendingRequests = user.requests.filter((req) => req.status === "pending").length;
    
        io.to(userId).emit("requestUpdated", { requestCount: pendingRequests });
        console.log(`Request count updated for user ${userId}: ${pendingRequests}`);
      } catch (err) {
        console.error("Error emitting request update:", err);
      }
    };
    
    // Example: Call emitRequestUpdate when a request is added/removed
    socket.on("add-request", async (userId) => {
      await emitRequestUpdate(userId);
    });
    
    socket.on("accept-request", async (userId) => {
      await emitRequestUpdate(userId);
    });
    
    socket.on("reject-request", async (userId) => {
      await emitRequestUpdate(userId);
    });

    // Heartbeat to track active connections
    const heartbeatInterval = setInterval(() => {
      onlineUsers.set(userId, {
        socketId: socket.id,
        lastActive: new Date(),
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

        // Find or create chat
        let chat = await Chat.findOne({ participants: { $all: [userId, to] } });
        if (!chat) {
          chat = new Chat({ participants: [userId, to], messages: [] });
        }

        // Add message to chat
        chat.messages.push(messageData);
        await chat.save();

        // Get the ID of the newly added message
        const savedMessage = chat.messages[chat.messages.length - 1];

        // Emit the message to the recipient if they are online
        const recipient = onlineUsers.get(to);
        if (recipient) {
          io.to(recipient.socketId).emit("receive-message", {
            ...messageData,
            _id: savedMessage._id,
            senderId: { _id: userId },
          });
        }

        // Send acknowledgement with message ID back to sender
        callback?.({ success: true, messageId: savedMessage._id });

        console.log("Message saved and sent successfully");
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