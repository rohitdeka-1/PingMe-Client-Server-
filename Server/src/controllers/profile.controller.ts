import type { Response, NextFunction } from "express";
import User, { IUser } from "../models/user.model";
import type { requestInterface } from "../middlewares/auth.middleware";
import { uploadOnCloudinary } from "../services/cloudinary.service";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import { io } from "../app";

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

export const handleRequest = async (
  req: requestInterface,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const targetId = req.params.targetId;
    const currentUser = req.user;

    // 1. Check if user is logged in
    if (!currentUser) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // 2. Check if targetId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ success: false, message: "Invalid target ID" });
    }

    // 3. Prevent user from sending request to themselves
    if (targetId === currentUser._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a request to yourself",
      });
    }

    // 4. Find the target user in the database
    const targetUser = await User.findById(targetId);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: "Target user not found" });
    }

    // Convert current user ID to string for comparison
    const currentUserId = currentUser._id.toString();

    // 5. Check if a friend request already exists
    let existingRequest = null;
    for (let request of targetUser.requests) {
      if (request.from.toString() === currentUserId) {
        existingRequest = request;
        break;
      }
    }

    let action: "sent" | "unsent";

    // 6. If request exists, remove it (unsend)
    if (existingRequest) {
      const newRequests = [];
      for (let request of targetUser.requests) {
        if (request.from.toString() !== currentUserId) {
          newRequests.push(request); // Keep only other requests
        }
      }
      targetUser.requests = newRequests;
      action = "unsent";
    } 
    // 7. If request doesn't exist, add a new one (send)
    else {
      targetUser.requests.push({ from: currentUser._id, status: "pending" });
      action = "sent";
    }

    // 8. Save the changes in the database
    await targetUser.save();

    // 9. Count how many pending requests are there
    let pendingCount = 0;
    for (let request of targetUser.requests) {
      if (request.status === "pending") {
        pendingCount++;
      }
    }

    // 10. Send real-time update using socket
    io.to(targetId).emit("requestUpdated", {
      requestCount: pendingCount,
    });

    // 11. Send success response
    return res.status(200).json({
      success: true,
      action: action,
      message: action === "sent" ? "Friend request sent" : "Friend request withdrawn",
      hasSentRequest: action === "sent",
    });

  } catch (error) {
    console.error("Error handling friend request:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUserRequests = async (
  req: requestInterface,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?._id;

    // 1. Find the current user and populate request senders' details
    const currentUser = await User.findById(userId).populate(
      "requests.from",
      "fullname email profilePic"
    );

    // 2. If user not found, return error
    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 3. Filter only the requests that are pending
    const pendingRequests = currentUser.requests.filter((request) => {
      return request.status === "pending";
    });

    // 4. Map (format) pending requests for the response
    const formattedRequests = pendingRequests.map((request) => {
      return {
        _id: request._id || request.from._id,
        from: request.from,
        status: request.status,
      };
    });

    // 5. Send success response
    return res.status(200).json({
      success: true,
      userId: currentUser._id,
      requests: formattedRequests,
    });

  } catch (error) {
    console.error("Error fetching requests:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const acceptRequest = async (
  req: requestInterface,
  res: Response
): Promise<any> => {
  const { fromUserId } = req.params;

  try {
    // 1. Find the current user by their ID
    const currentUser = await User.findById(req.user?._id);

    // 2. If user not found, return error
    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

 
    // 4. Find the pending request from the specific user (fromUserId)
    const request = currentUser.requests.find((request) => {
      return request.from.toString() === fromUserId && request.status === "pending";
    });

    // 5. If request is not found, return error
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    // 6. Update the request status to 'accepted'
    request.status = "accepted";
    await currentUser.save();

    // 7. Emit the updated request count to the user
    io.to(currentUser._id.toString()).emit("requestUpdated", {
      requestCount: currentUser.requests.filter((request) => request.status === "pending").length,
    });

    // 8. Return success message
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
    // 1. Find the current user by their ID
    const currentUser = await User.findById(req.user?._id);

    // 2. If user not found, return error
    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 3. Store the original length of the requests array to check if we removed a request
    const originalLength = currentUser.requests.length;

    // 4. Filter out the pending request from the specific user (fromUserId)
    currentUser.requests = currentUser.requests.filter((request) => {
      return request.from.toString() !== fromUserId || request.status !== "pending";
    });

    // 5. If no request was removed, return error (request not found)
    if (currentUser.requests.length === originalLength) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    // 6. Save the updated user data
    await currentUser.save();

    // 7. Return success message
    return res.status(200).json({ success: true, message: "Request rejected" });

  } catch (error) {
    console.error("Reject error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const getAcceptedUsers = async (
  req: requestInterface,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?._id;

    // Find the current user and populate request senders' details
    const currentUser = await User.findById(userId).populate(
      "requests.from", // Populate the `from` field
      "fullname profilePic email" // Specify the fields to populate
    );

    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Filter requests with status "accepted"
    const acceptedRequests = currentUser.requests.filter(
      (request) => request.status === "accepted"
    );

    // Format the accepted requests for the response
    const formattedAcceptedUsers = acceptedRequests.map((request) => {
      if (!request.from || typeof request.from !== "object") {
        console.error("Invalid request.from:", request.from);
        return null; // Skip invalid requests
      }

      const from = request.from as IUser; // Cast `from` to the IUser type
      return {
        id: from._id,
        name: from.fullname,
        profilePic: from.profilePic,
      };
    }).filter(Boolean); // Remove null values

    return res.status(200).json({
      success: true,
      acceptedUsers: formattedAcceptedUsers,
    });
  } catch (error) {
    console.error("Error fetching accepted users:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};