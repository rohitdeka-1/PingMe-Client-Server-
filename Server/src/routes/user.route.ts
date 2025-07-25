import type express from "express"
import { Router } from "express"
import { acceptRequest, getAcceptedUsers, getUserProfile, getUserRequests, handleRequest, rejectRequest, updateUser, uploadImage } from "../controllers/profile.controller"
import { upload } from "../middlewares/multer.middleware"
import { verifyToken } from "../middlewares/auth.middleware"

const userRouter = Router()

const uploadMulter = upload.single("profilePic") as unknown as express.RequestHandler
const uploadImages = upload.single("gallery") as unknown as express.RequestHandler
userRouter.post("/edit-profile", verifyToken, uploadMulter, updateUser)
userRouter.get("/profile", verifyToken, getUserProfile)
userRouter.get("/profile/:username", verifyToken, getUserProfile)
userRouter.post("/upload-image", verifyToken, uploadImages, uploadImage)
userRouter.get("/accepted-users",verifyToken,getAcceptedUsers)
userRouter.post("/request/:targetId", verifyToken, handleRequest)
userRouter.get("/requests", verifyToken, getUserRequests);
userRouter.post("/requests/accept/:fromUserId", verifyToken, acceptRequest);
userRouter.post("/requests/reject/:fromUserId", verifyToken, rejectRequest);


export default userRouter