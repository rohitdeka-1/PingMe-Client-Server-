import { Response, Request, NextFunction } from "express";

export const handleUserLogout = async(req:Request, res:Response, next :NextFunction):Promise<any> => {
    try{
        res.clearCookie("ACCESS_TOKEN",{
            httpOnly: true
        })
    }
    catch(err){
        console.error("Error in Logging Out : ",err)
        return res.status(500).json({
            success : false,
            message : "Internal server Error"
        })
    }
}