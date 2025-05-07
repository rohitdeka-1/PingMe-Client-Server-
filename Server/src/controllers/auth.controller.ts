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

  const existedEmail = await User.findOne({ email });
  if (existedEmail) {
    return res.status(409).json({
      success: false,
      message: "Email Already Registered",
    });
  }
  const existedUsername = await User.findOne({ username });
  if (existedUsername) {
    return res.status(409).json({
      success: false,
      message: "Username Already Exists",
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
      return res.status(400).json({
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

    


    return res.status(200).json({
      success: true,
      message: "User Created Successfully",
      accessToken: TOKEN,
    });

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
): Promise<any> => {
  const { identity, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ username: identity }, { email: identity }],
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not in database",
      });
    } else {
      const isPasswordValid = await bcryptjs.compare(
        password,
        user?.password as string
      );
      if (!isPasswordValid) {
        return res.status(400).json({
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
 
      return res.status(200).json({
        success: true,
        message: "Access Granted",
        token: TOKEN,
      });
    }
  } catch (err) {
    console.error("Error while Login : ", err);
    return res.status(500).json({ 
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
        expiresIn: "1h",
      }
    );

    const resetLink = `https://pingme-delta.vercel.app/resetpassword/${encodeURIComponent(
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

export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { password1, password2 } = req.body
  const { token } = req.params
  console.log("Change password request received:", { token, password1: "***", password2: "***" })

  try {
    if (password1 !== password2) {
      return res.status(401).json({
        success: false,
        message: "Both passwords should be the same",
      })
    }

    const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET!)
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "UnAuthorized",
      })
    }
    const userId = (decoded as { userId: string }).userId

    const user = await User.findById(userId)
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      })
    }

    user.password = password1
    await user.save()

    // Send success response
    console.log("Password updated successfully for user:", userId)
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (err) {
    console.error("Error in changePassword:", err)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}
