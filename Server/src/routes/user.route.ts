import express, { Router } from "express"
import {getUserProfile, updateUser, uploadImage}  from "../controllers/profile.controller";
import { upload } from "../middlewares/multer.middleware";
import { verifyToken } from "../middlewares/auth.middleware";

const userRouter = Router();

const uploadMulter = upload.single('profilePic') as unknown as express.RequestHandler
const uploadImages = upload.single('gallery') as unknown as express.RequestHandler
userRouter.post("/edit-profile",verifyToken,uploadMulter,updateUser)
userRouter.get("/profile",verifyToken,getUserProfile);
userRouter.get("/profile/:username",getUserProfile);
userRouter.post("/upload-image",verifyToken,uploadImages,uploadImage)
export default userRouter;

