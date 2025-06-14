import { Request, Response } from "express";
import Chat from "../models/chat.model";
import User from "../models/user.model";
import { requestInterface } from "../middlewares/auth.middleware";
import { Types } from "mongoose";

// Fetch chat messages between two users
export const getChatMessages = async (req: requestInterface, res: Response): Promise<any> => {
  try {
    const { userId } = req.params; // Target user ID
    const currentUserId = req.user?._id.toString(); // Convert ObjectId to string
    const limit = parseInt(req.query.limit as string) || 25; // Default limit is 25
    const offset = parseInt(req.query.offset as string) || 0; // Default offset is 0

    // Find the chat between the two users
    const chat = await Chat.findOne({
      participants: { $all: [currentUserId, userId] },
    }).populate("messages.senderId", "fullname profilePic");

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    // Paginate messages
    const totalMessages = chat.messages.length;
    const paginatedMessages = chat.messages
      .slice(totalMessages - offset - limit, totalMessages - offset)
      .reverse(); // Reverse to show the latest messages first

    return res.status(200).json({
      success: true,
      currentUserId,
      messages: paginatedMessages,
      hasMore: offset + limit < totalMessages, // Check if there are more messages to load
    });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// Send a message
export const sendMessage = async (req: requestInterface, res: Response):Promise<any> => {
  try {
    const { userId } = req.params; // Target user ID
    const currentUserId = req.user?._id; // Current logged-in user ID
    if (!currentUserId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    const { content } = req.body; // Message content

    if (!content) {
      return res.status(400).json({ success: false, message: "Message content is required" });
    }

    // Find or create a chat between the two users
    let chat = await Chat.findOne({
      participants: { $all: [currentUserId, userId] },
    });

    if (!chat) {
      chat = new Chat({
        participants: [currentUserId, userId],
        messages: [],
      });
    }

    // Add the new message to the chat
    chat.messages.push({
      senderId: currentUserId,
      receiverId: new Types.ObjectId(userId),
      content,
      timestamp: new Date(),
    });

    await chat.save();

    return res.status(201).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};