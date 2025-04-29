import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log("DB connected");

  } catch (err) {
    console.log("Error connecting DB", err);
  }
};

export default connectDB;
