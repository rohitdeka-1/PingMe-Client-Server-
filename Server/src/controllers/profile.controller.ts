import type { Response, NextFunction } from "express";
import User from "../models/user.model";
import type { requestInterface } from "../middlewares/auth.middleware";
import { uploadOnCloudinary } from "../services/cloudinary.service";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

export const updateUser = async (
  req: requestInterface,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { about, fullname } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updateData: Partial<{
      about: string;
      profilePic: string;
      fullname: string;
    }> = {};

    if (about && about !== currentUser.about) updateData.about = about;
    if (fullname && fullname !== currentUser.fullname)
      updateData.fullname = fullname;

    if (req.file?.path) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (!uploadResult) {
        return res.status(400).json({
          success: false,
          message: "Couldn't upload image to Cloudinary",
        });
      }

      if (uploadResult.secure_url !== currentUser.profilePic) {
        if (currentUser.profilePic) {
          const publicId = currentUser.profilePic
            .split("/")
            .pop()
            ?.split(".")[0];
          if (publicId) await cloudinary.uploader.destroy(publicId);
        }
        updateData.profilePic = uploadResult.secure_url;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No new changes to update",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found after update",
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
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getUserProfile = async (
  req: requestInterface,
  res: Response
): Promise<any> => {
  try {
    const { username } = req.params;

    let query: any = username
      ? { username }
      : req.user
      ? { _id: req.user._id }
      : null;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "No query provided",
      });
    }

    const user = await User.findOne(query).populate(
      "requests.from",
      "username email profilePic"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let hasSentRequest = false;

    if (req.user && user.requests?.length > 0) {
      hasSentRequest = user.requests.some((request) => {
        const fromId =
          typeof request.from === "object" && request.from?._id
            ? request.from._id.toString()
            : String(request.from);
        return fromId === req.user!._id.toString();
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        fullname: user.fullname,
        about: user.about,
        profilePic: user.profilePic,
        userImages: user.userImages,
        username: user.username,
        requests: user.requests,
      },
      hasSentRequest,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const uploadImage = async (
  req: requestInterface,
  res: Response
): Promise<any> => {
  try {
    if (!req.file?.path) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (!uploadResult) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload image to Cloudinary",
      });
    }

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.userImages = user.userImages || [];
    user.userImages.push(uploadResult.secure_url);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const handeRequest = async (
  req: requestInterface,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { targetId } = req.params;

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid target ID" });
    }

    if (targetId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a request to yourself",
      });
    }

    const targetUser = await User.findById(targetId);
    if (!targetUser) {
      return res
        .status(404)
        .json({ success: false, message: "Target user not found" });
    }

    const existingRequest = targetUser.requests.find(
      (r) => r.from.toString() === req.user!._id.toString()
    );

    let hasSentRequest = false;

    if (existingRequest) {
      targetUser.requests = targetUser.requests.filter(
        (r) => r.from.toString() !== req.user!._id.toString()
      );
      hasSentRequest = false;
    } else {
      targetUser.requests.push({ from: req.user._id, status: "pending" });
      hasSentRequest = true;
    }

    await targetUser.save();

    return res.status(200).json({
      success: true,
      action: existingRequest ? "unsent" : "sent",
      message: existingRequest
        ? "Friend request withdrawn"
        : "Friend request sent",
      hasSentRequest,
    });
  } catch (error) {
    console.error("Error handling friend request:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export const getUserRequests = async (
  req: requestInterface,
  res: Response
): Promise<any> => {
  try {
    const currentUser = await User.findById(req.user?._id).populate(
      "requests.from",
      "fullname email profilePic"
    );

    if (!currentUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const pendingRequests = currentUser.requests.filter(
      (r) => r.status === "pending"
    );

    return res.status(200).json({
      success: true,
      requests: pendingRequests.map((request) => ({
        _id: request._id || request.from._id,
        from: request.from,
        status: request.status,
      })),
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
 
export const acceptRequest = async (
  req: requestInterface,
  res: Response
): Promise<any> => {
  const { fromUserId } = req.params;

  try {
    const currentUser = await User.findById(req.user?._id);

    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("User requests array:", currentUser.requests.map(r => ({
      _id: r._id?.toString(),
      from: r.from.toString(),
      status: r.status,
    })));

    console.log("fromUserId from param:", fromUserId);

    // Find matching request by 'from' field
    const request = currentUser.requests.find(
      (r) => r.from.toString() === fromUserId && r.status === "pending"
    );

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    request.status = "accepted";
    await currentUser.save();

    return res.status(200).json({ success: true, message: "Request accepted" });
  } catch (error) {
    console.error("Accept error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};



export const rejectRequest = async (
  req: requestInterface,
  res: Response
): Promise<any> => {
  const { fromUserId } = req.params;

  try {
    const currentUser = await User.findById(req.user?._id);

    if (!currentUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Filter out the request from that specific user
    const originalLength = currentUser.requests.length;
    currentUser.requests = currentUser.requests.filter(
      (r) => r.from.toString() !== fromUserId || r.status !== "pending"
    );

    // If no request was removed
    if (currentUser.requests.length === originalLength) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    await currentUser.save();

    return res.status(200).json({ success: true, message: "Request rejected" });
  } catch (error) {
    console.error("Reject error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};
