import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMessage extends Document {
  sender: Types.ObjectId;
  content: string;
  roomId: Types.ObjectId;
  seen: boolean;
  timestamp: Date;
}

const messageSchema = new Schema<IMessage>({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true, trim: true },
  roomId: { type: Schema.Types.ObjectId, ref: "ChatRoom", required: true },
  seen: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IMessage>("Message", messageSchema);
