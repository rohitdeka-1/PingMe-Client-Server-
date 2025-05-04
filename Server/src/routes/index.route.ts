import { Router } from "express";
import authRoute from "./auth.route";
import searchRoute from "./search.route";
import userRouter from "./user.route";

const router = Router();

router.use("/auth",authRoute);
router.use("/search",searchRoute)
router.use("/user",userRouter)

export default router;