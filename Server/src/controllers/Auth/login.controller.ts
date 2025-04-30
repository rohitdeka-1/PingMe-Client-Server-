import  express, { Response,Request,NextFunction }  from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {requestInterface} from "../../middlewares/auth.middleware"
import User from "../../models/user.model"
import dotenv from "dotenv";
dotenv.config();
console.log( process.env.ACCESS_TOKEN_SECRET)


export const handleUserLogin = async(req:Request,res:Response,next:NextFunction):Promise<any> => {
    const {identity,password} = req.body;
    if(!identity&&!password){
        return res.status(401).json({
            success : false,
            message : "Both fields are required"
        })
    }

    try{
        const user = await User.findOne({$or:[{username:identity},{email:identity}],
        });
        if(!user){
            return res.status(401).json({
                success : false,
                message : "User not in database"
            })
        }

        const isPasswordValid = await bcryptjs.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(401).json({
                success : false,
                message : "Invalid Credentials"
            })
        }

        const TOKEN = jwt.sign(
            {
                userId: user._id,
                username : user.username
            },
            process.env.ACCESS_TOKEN_SECRET!,
            {
                expiresIn: "1h",
            }
        )

        res.cookie(
            "ACCESS_TOKEN",
            TOKEN,
            {
                httpOnly: true,
            }
        )

        return res.status(200).json({
            success: true,
            message : "Access Granted"
        })

       
    }
    catch(err){
        console.error("Error while Login : ", err );
        return res.status(500).json({
            success: false,
            message: "Internal server error",
          });
    }

}