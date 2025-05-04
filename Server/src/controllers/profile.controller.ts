import express, { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { requestInterface } from "../middlewares/auth.middleware";
import { uploadOnCloudinary } from "../services/cloudinary.service";
import { v2 as cloudinary } from "cloudinary";
const updateUser = async (
  req: requestInterface,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { about, fullname } = req.body;
    const updateData: Partial<{
      about: string;
      profilePic: string;
      fullname: string;
    }> = {};

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Fetch the current user data
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare and update only if the new value is different
    if (about && about !== currentUser.about) {
      console.log(`Updating about: ${currentUser.about} -> ${about}`); // Debugging log
      updateData.about = about;
    }

    if (fullname && fullname !== currentUser.fullname) {
      console.log(`Updating fullname: ${currentUser.fullname} -> ${fullname}`); // Debugging log
      updateData.fullname = fullname;
    }

    if (req.file) {
      const localFilePath = req.file.path;

      if (!localFilePath) {
        return res.status(400).json({
          success: false,
          message: "No file found",
        });
      }

      const uploadResult = await uploadOnCloudinary(localFilePath);
      if (!uploadResult) {
        return res.status(400).json({
          success: false,
          message: "Couldn't upload image to Cloudinary",
        });
      }

      // Check if the new profilePic is different from the current one
      if (uploadResult.secure_url !== currentUser.profilePic) {
        console.log(
          `Updating profilePic: ${currentUser.profilePic} -> ${uploadResult.secure_url}`
        ); // Debugging log
        if (currentUser.profilePic) {
          const publicId = currentUser.profilePic
            .split("/")
            .pop()
            ?.split(".")[0];
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
          console.log("Removed old profile photo");
        }

        updateData.profilePic = uploadResult.secure_url;
      }
    }

    // If no valid fields are provided for update, return an error
    if (Object.keys(updateData).length === 0) {
      console.log("No new changes to update. Update data:", updateData); // Debugging log
      return res.status(400).json({
        success: false,
        message: "No new changes to update",
      });
    }

    // Update the user in the database
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const securedUserObject = {
      _id: updatedUser._id,
      fullname: updatedUser.fullname,
      username: updatedUser.username,
      email: updatedUser.email,
      about: updatedUser.about,
      profilePic: updatedUser.profilePic,
    };

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: securedUserObject,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export { updateUser };

export const getUserProfile = async (
  req: requestInterface,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
