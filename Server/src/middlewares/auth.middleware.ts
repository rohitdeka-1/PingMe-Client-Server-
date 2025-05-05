import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/user.model"
import dotenv from "dotenv";

dotenv.config();

export interface requestInterface extends Request {
    user?: IUser;
}
export const verifyToken = async(req:requestInterface,res:Response,next:NextFunction):Promise<any> => {
    const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json({"success":false,"message" : "Access Denied"});
    try{
        const decoded:{userId:string} = jwt.verify(token,`${JWT_SECRET}` ) as {userId:string};
        const user = await User.findOne({_id:decoded.userId});

    
        if (!user) {
            return res.status(401).json({ "success": false, "message": "User not found" });
          }

        req.user = user;


        next();
    }
    catch(err){
        res.status(401).json(
            {
                "success" : false,
                "message" : "Invalid or expired token"
            }
        )
    }
}

 