// import mongoose, { Document, Schema, Types } from "mongoose";

// export interface IMessage extends Document<Types.ObjectId> {
//   sender: Types.ObjectId;
//   content: string;
//   userId: Types.ObjectId;
//   status: "SENT" | "DELIVERED" | "SEEN";
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// const messageSchema = new Schema<IMessage>(
//   {
//     sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     content: { type: String, required: true, trim: true },
//     userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     status: { type: String, enum: ["SENT", "DELIVERED", "SEEN"], default: "SENT" },
//   },
//   {
//     timestamps: true, // This will automatically add createdAt and updatedAt fields
//   }
// );

// export default mongoose.model<IMessage>("Message", messageSchema);