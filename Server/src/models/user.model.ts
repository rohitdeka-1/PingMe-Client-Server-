import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface IRequest {
  from: Types.ObjectId;
  status: "pending" | "accepted";
}

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  requests: IRequest[];
  chats: Types.ObjectId[];
  lastSeen?: Date;
  createdAt: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  comparePassword: (password: string) => Promise<boolean>;
}

const requestSchema = new Schema<IRequest>(
  {
    from: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted"], default: "pending" },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  requests: [requestSchema],
  chats: [{ type: Schema.Types.ObjectId, ref: "ChatRoom" }],
  lastSeen: { type: Date },
  createdAt: { type: Date, default: Date.now },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>("user", userSchema);