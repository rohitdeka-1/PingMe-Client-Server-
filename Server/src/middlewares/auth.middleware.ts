import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model"
import dotenv from "dotenv";

dotenv.config();

export interface requestInterface extends Request {
    userId?: string;
    user?: {
        _id: string;
        profilePic?: string;
        user:any;
      };
    file?: Express.Multer.File;
} 

export const verifyToken = async(req:requestInterface,res:Response,next:NextFunction):Promise<void> => {
    const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;
    // const Token = req.headers.authorization;
    const TOKEN = req.cookies.ACCESS_TOKEN;
    if(!TOKEN){
        res.status(401).json({
            success : false,
            message: "Unauthorized"
        })
    }
    try{
        const decoded = jwt.verify(TOKEN,`${JWT_SECRET}`) as JwtPayload ;
        if(!decoded || typeof(decoded)!=="object" || !decoded.userId){
            console.error("Invalid JWT Token ")
            res.status(400).json({
                success : false,
                message : "Invalid JWT Token"
            })
        }
        
        const user = await User.findById(decoded.userId) as { _id: string; profilePic?: string; [key: string]: any };
        if(!user){
            res.status(401).json({
                success: false,
                message : "User not found" 
            })
        }
        if (user) {
            req.user = {
                _id: user._id,
                profilePic: user.profilePic,
                user: user
            };
        }
        next();
    }
    catch(error){
        console.error("Error in token verification : ",error);
    }
}