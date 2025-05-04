import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface IRequest {
  from: Types.ObjectId;
  status: "pending" | "accepted";
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  requests: IRequest[];
  chats: Types.ObjectId[];
  lastSeen?: Date;
  about?: string;
  createdAt: Date;
  profilePic: string;
  fullname: string;
  userImages: string[];

  comparePassword: (password: string) => Promise<boolean>;
}

const requestSchema = new Schema<IRequest>(
  {
    from: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted"], default: "pending" },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    fullname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    requests: [requestSchema],
    chats: [{ type: Schema.Types.ObjectId, ref: "ChatRoom" }],
    about: { type: String, default: "" },
    lastSeen: { type: Date },
    profilePic: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
    userImages: [{type:String}],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
// userSchema.methods.comparePassword = async function (password: string) {
//   return bcrypt.compare(password, this.password);
// };

export default mongoose.model<IUser>("user", userSchema);
