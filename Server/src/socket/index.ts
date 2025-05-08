import { Server } from "socket.io";
import jwt from "jsonwebtoken";

export const initSocket = (io: Server) => {
  // Authentication middleware for Socket.io
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token; // Get token from socket handshake

    if (!token) {
      return next(new Error("No token provided"));
    }

    try {
      // Verify the token using the same secret and logic as the JWT middleware
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as jwt.JwtPayload;
      console.log("Decoded Token:", decoded); // Log decoded token to inspect

      // Ensure the decoded token contains userId (based on your verifyToken middleware)
      if (typeof decoded !== "string" && "userId" in decoded) {
        socket.data.userId = decoded.userId; // Store userId on the socket for future use
        next(); // Proceed with connection
      } else {
        throw new Error("Invalid token payload");
      }
    } catch (err) {
      console.error("Socket auth failed:", err instanceof Error ? err.message : err);
      next(new Error("Authentication error"));
    }
  });

  // Handle new socket connections
  io.on("connection", (socket) => {
    const userId = socket.data.userId; // Access userId from socket.data

    if (!userId) {
      console.error("User ID not found. Disconnecting...");
      socket.disconnect(); // Disconnect if no userId
      return;
    }

    socket.join(userId); // Join the user's specific room
    console.log(`Socket connected: ${socket.id}, userId: ${userId}`);

    // Listen for "send-message" events
    socket.on("send-message", ({ to, content }) => {
      const message = {
        sender: userId,
        content,
        createdAt: new Date(),
      };
      io.to(to).emit("receive-message", message); // Emit message to recipient
    });

    // Handle socket disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
