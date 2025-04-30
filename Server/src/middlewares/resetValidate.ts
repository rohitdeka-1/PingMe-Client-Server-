import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export const resetPassPagevalidation = async (
    req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET!);
    if (!decoded) {
    return  res.status(200).json({
        success: true,
        message: "Not authorized without mail link ",
      });
    }

    console.log("Decoded token: ", decoded);
    return res.status(200).json({
      success: true,
      message: "Access Granted",
    });
  } catch (err) {
    console.error("Token validation error: ", err); 
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
