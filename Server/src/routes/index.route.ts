import { Router } from "express";
import authRoute from "./auth.route";
import searchRoute from "./search.route";

const router = Router();

router.use("/auth",authRoute);
router.use("/user",authRoute);
router.use("/search",searchRoute)
export default router;