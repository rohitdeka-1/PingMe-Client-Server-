import mongoose, { Document, Schema, Types } from "mongoose";

export interface IChatRoom extends Document {
  participants: Types.ObjectId[];
  messages: Types.ObjectId[];
  lastMessage?: Types.ObjectId;
  createdAt: Date;
}

const chatRoomSchema = new Schema<IChatRoom>({
  participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IChatRoom>("ChatRoom", chatRoomSchema);
