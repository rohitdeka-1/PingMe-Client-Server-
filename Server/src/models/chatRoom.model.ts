import mongoose, { Document, Schema, Types } from "mongoose";

export interface IChatRoom extends Document {
  participants: Types.ObjectId[]; // always 2 for now
  messages: Types.ObjectId[];
  lastMessage?: Types.ObjectId;
  typingStatus: {
    [userId: string]: boolean;
  };
  createdAt: Date;
}

const chatRoomSchema = new Schema<IChatRoom>(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    typingStatus: {
      type: Map,
      of: Boolean,
      default: {},
    },
    createdAt: { type: Date, default: Date.now },
  }
);

export default mongoose.model<IChatRoom>("ChatRoom", chatRoomSchema);
