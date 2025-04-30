import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model";
import dotenv from "dotenv";

dotenv.config()

export const handleSendResetMail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { email } = req.body;
  console.log(email);
  if (!email) {
    return res.status(401).json({
      success: false,
      message: "Email is missing",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User Doesn't exists",
      });
    }

    const TOKEN = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.RESET_TOKEN_SECRET!,
      {
        expiresIn: "10m",
      }
    );


    //yaad dila dena
    console.log(TOKEN)

    const resetLink = `http://localhost:5173/resetpassword/${encodeURIComponent(TOKEN)}`;


    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GOOGLE_EMAIL_ID,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GOOGLE_EMAIL_ID,
      to: user.email,
      subject: "Password Reset Request",
      html: `
  <div style="background-color:#161717; padding:20px; color:#ffffff; font-family:Arial, sans-serif; text-align:center; max-width:500px; margin:auto; border-radius:10px;">
    <h2 style="color:#ffffff;">🔒 Password Reset Request</h2>
    <p style="font-size:16px; color:#dddddd;">
      You requested a password reset. Tap the button below to set a new password.
    </p>
    <a href="${resetLink}" 
       style="display:inline-block; margin:20px auto; padding:12px 20px; background-color:#00bcd4; color:#fff; text-decoration:none; border-radius:5px; font-weight:bold;">
       Reset Password
    </a>
    <p style="font-size:14px; color:#888888; margin-top:30px;">
      This link will expire in 10 minutes. If you didn't request this, you can safely ignore it.
    </p>
  </div>
`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(info);

    return res.status(200).json({
        success: true,
        message : "Reset Link send successfully"
    })

  } catch (err) {
    console.error("Error Sending Reset Mail : ", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
