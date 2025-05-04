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
    const { username } = req.params;

    let query:any = { _id: req.user?._id };   

    if(username){
      query={
        username 
      }
    }
   
    const user = await User.findOne( query );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        fullname: user.fullname,
        about: user.about,
        profilePic: user.profilePic,
        userImages: user.userImages,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const uploadImage = async (
  req: requestInterface,
  res: Response
): Promise<any> => {
  try {
    // Validate if a file is provided
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Upload the file to Cloudinary
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (!uploadResult) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload image to Cloudinary",
      });
    }

    // Validate user authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Fetch the user from the database
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Initialize userImages array if not already present
    user.userImages = user.userImages || [];
    user.userImages.push(uploadResult.secure_url);

    // Save the updated user document
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
