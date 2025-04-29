import { NextFunction, Request, Response } from "express";
import {User} from "../../models/user.model"
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();


const handleUserRegister = async(req:Request, res:Response, next:NextFunction) => {
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

        const accessToken =jwt.sign(
            {
                userId : creationUser._id,
                username
            },
            
        )

    }
    catch(error){
        console.error("Error during Registration : ",error);
    }
}