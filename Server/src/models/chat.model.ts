import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMessage {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  content: string;
  timestamp: Date;
}

export interface IChat extends Document {
  participants: Types.ObjectId[]; 
  messages: IMessage[];
}

const MessageSchema = new Schema<IMessage>({
  senderId: { type: Schema.Types.ObjectId, ref: "user", required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: "user", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatSchema = new Schema<IChat>({
  participants: [{ type: Schema.Types.ObjectId, ref: "user", required: true }],
  messages: [MessageSchema],
});

const Chat = mongoose.model<IChat>("Chat", ChatSchema);
export default Chat;