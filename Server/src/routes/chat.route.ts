import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { getChatMessages, sendMessage } from "../controllers/chat.controller";

const chatRouter = Router();

// Fetch chat messages
chatRouter.get("/:userId", verifyToken, getChatMessages);

// Send a message
chatRouter.post("/:userId", verifyToken, sendMessage);

export default chatRouter;