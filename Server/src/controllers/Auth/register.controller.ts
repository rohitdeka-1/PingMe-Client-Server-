import { NextFunction, Request, Response } from "express";
import User from "../../models/user.model"
import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();



export const handleUserRegister = async(req:Request, res:Response, next:NextFunction):Promise<any> => {
    const {fullname,email,password,username} = req.body;
    console.log(fullname,email,username);
    const existedUser = await User.findOne({$or:[{email},{password}]});
        if(existedUser){
            return res.status(409).json({
                success : false,
                message : "User Already Exists"
            })
        } 
    try{
        const creationUser = await User.create({
            "fullname" : fullname,
            "email" : email,
            "password" : password,
            "username" : username,
        })

        if(!creationUser){
            res.status(400).json({
                success: false,
                message:"Failed User Creation"
            })
        }

        const TOKEN =jwt.sign(
            {
                userId : creationUser._id,
                username,
            },

            process.env.ACCESS_TOKEN_SECRET as string,

            {
                expiresIn : "1d",
            } as SignOptions            
        )
        const refreshToken = jwt.sign(
            {
                userId : creationUser._id,
                username,
            },

            process.env.ACCESS_TOKEN_SECRET as string,

            {
                expiresIn : "1d",
            } as SignOptions            
        )

        res.cookie(
            "ACCESS_TOKEN",
            TOKEN,
            {
                httpOnly: true,
            }
        )
        res.status(200).json({
            success: true,
            message: "User Created Successfully"
        })

        return;

    }



    catch(error){
        console.error("Error during Registration : ",error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
          });
    }


}