import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/user.model"
import dotenv from "dotenv";

dotenv.config();

export interface requestInterface extends Request {
    user?: IUser;
}

export const verifyToken = async (req: requestInterface, res: Response, next: NextFunction): Promise<any> => {
    const authHeader = req.headers.authorization;  
    const token = authHeader && authHeader.split(" ")[1];  

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;
        if (!decoded || typeof decoded !== "object" || !decoded.userId) {
            return res.status(400).json({
                success: false,
                message: "Invalid JWT Token",
            });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in token verification:", error);
        res.status(401).json({
            success: false,
            message: "Internal server error",
        });
    }
};

 