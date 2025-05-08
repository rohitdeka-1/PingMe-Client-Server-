import { Router } from "express";
import authRoute from "./auth.route";
import searchRoute from "./search.route";
import userRouter from "./user.route";
import chatRouter from "./chat.route";

const router = Router();

router.use("/auth",authRoute);
router.use("/search",searchRoute)
router.use("/user",userRouter)
router.use("/chat", chatRouter); 

export default router;