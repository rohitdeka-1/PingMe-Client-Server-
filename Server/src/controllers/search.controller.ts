import express, { Request, Response } from "express";
import User from "../models/user.model";

export const handleSearch = async (req: Request, res: Response):Promise<any> => {
  try {
    const q = req.query.q;
    const limit = parseInt(req.query.limit as string || "8");

    if (!q) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    // Use regex to match the sequence of characters entered (sequential search)
    const regex = new RegExp(`^${q}`, "i"); // ^ ensures it matches the beginning of the username
 
    const users = await User.find({
      $or:[{username:regex},{email:regex}]
      
    }).limit(limit);
    
    res.json({ results: users });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
