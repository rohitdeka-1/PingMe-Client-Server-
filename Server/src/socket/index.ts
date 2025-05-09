import type { Server } from "socket.io"
import jwt from "jsonwebtoken"
import Chat from "../models/chat.model"
import { Types } from "mongoose"

export const initSocket = (io: Server) => {
  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token

    if (!token) {
      return next(new Error("No token provided"))
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as jwt.JwtPayload
      socket.data.userId = decoded.userId // Store userId in socket
      next()
    } catch (err) {
      console.error("Socket authentication failed:", err)
      next(new Error("Authentication error"))
    }
  })

  // Handle socket connections
  io.on("connection", (socket) => {
    const userId = socket.data.userId

    if (!userId) {
      console.error("User ID not found. Disconnecting...")
      socket.disconnect()
      return
    }

    // Join the user to their specific room
    socket.join(userId)
    console.log(`User connected: ${userId}, Socket ID: ${socket.id}`)

    // Listen for "send-message" events
    socket.on("send-message", async ({ to, content }, callback) => {
      try {
        // Create message object
        const messageData = {
          senderId: new Types.ObjectId(userId),
          receiverId: new Types.ObjectId(to),
          content,
          timestamp: new Date(),
        }

        // Find or create chat
        let chat = await Chat.findOne({
          participants: { $all: [userId, to] },
        })

        if (!chat) {
          chat = new Chat({
            participants: [userId, to],
            messages: [],
          })
        }

        // Add message to chat
        chat.messages.push(messageData)
        await chat.save()

        // Get the ID of the newly added message
        const savedMessage = chat.messages[chat.messages.length - 1]
        const messageId = savedMessage._id

        // Emit the message to the recipient with the database ID
        const messageToSend = {
          ...messageData,
          _id: messageId,
          senderId: { _id: userId }, // Format for client consistency
        }

        io.to(to).emit("receive-message", messageToSend)

        // Send acknowledgement with message ID back to sender
        if (typeof callback === "function") {
          callback({ success: true, messageId })
        }

        console.log("Message saved and sent successfully")
      } catch (err) {
        console.error("Error processing message:", err)
        if (typeof callback === "function") {
          callback({ success: false, error: "Failed to process message" })
        }
      }
    })

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`)
    })
  })
}
