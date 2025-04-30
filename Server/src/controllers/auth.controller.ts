import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import jwt, { SignOptions } from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

export const handleUserRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { fullname, email, password, username } = req.body;
  console.log(fullname, email, username);

  const existedUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existedUser) {
    return res.status(409).json({
      success: false,
      message: "User Already Exists",
    });
  }
  try {
    const creationUser = await User.create({
      fullname,
      email,
      password,
      username,
    });

    if (!creationUser) {
      res.status(400).json({
        success: false,
        message: "Failed User Creation",
      });
    }

    const TOKEN = jwt.sign(
      {
        userId: creationUser._id,
        username,
      },

      process.env.ACCESS_TOKEN_SECRET as string,

      {
        expiresIn: "1d",
      } as SignOptions
    );
    const refreshToken = jwt.sign(
      {
        userId: creationUser._id,
        username,
      },

      process.env.ACCESS_TOKEN_SECRET as string,

      {
        expiresIn: "1d",
      } as SignOptions
    );

    res.cookie("ACCESS_TOKEN", TOKEN, {
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "User Created Successfully",
    });

    return;
  } catch (error) {
    console.error("Error during Registration : ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const handleUserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { identity, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ username: identity }, { email: identity }],
    });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not in database",
      });
    } else {
      const isPasswordValid = await bcryptjs.compare(
        password,
        user?.password as string
      );
      if (!isPasswordValid) {
        res.status(400).json({
          success: false,
          message: "Invalid Credentials",
        });
      }

      const TOKEN = jwt.sign(
        {
          userId: user?._id,
          username: user.username,
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
          expiresIn: "1h",
        }
      );

      res.cookie("ACCESS_TOKEN", TOKEN, {
        httpOnly: true,
      });

      res.status(200).json({
        success: true,
        message: "Access Granted",
      });
    }
  } catch (err) {
    console.error("Error while Login : ", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const handleUserLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    res.clearCookie("ACCESS_TOKEN", {
      httpOnly: true,
    });
  } catch (err) {
    console.error("Error in Logging Out : ", err);
    return res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
};

export const handleSendResetMail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { email } = req.body;
  console.log(email);


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


    const resetLink = `http://localhost:5173/resetpassword/${encodeURIComponent(
      TOKEN
    )}`;

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
  <div style="background-color:#161717; padding:20px; color:#ffffff; font-family:Arial, sans-serif; text-align:center; max-width:100%; margin:auto; border-radius:10px;">
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

    const info = transporter.sendMail(mailOptions);
    console.log(info);

    return res.status(200).json({
      success: true,
      message: "Reset Link send successfully",
    });
  } catch (err) {
    console.error("Error Sending Reset Mail : ", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const changePassword = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
  const { password, password2 } = req.body;
  console.log(password, password2);

  try {
    if (password !== password2) {
      res.status(401).json({
        success: false,
        message: "Both password should be same",
      });
    }

    

    const user = await User.()

  } catch (err) {
    console.error("Err : ",err)
    res.status(500).json({
        success: false,
        message: "Internal server error"
    })
  }
};
