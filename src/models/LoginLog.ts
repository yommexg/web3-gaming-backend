import mongoose, { Schema, Document } from "mongoose";

interface ILoginLog extends Document {
  user: mongoose.Types.ObjectId;
  ip: string;
  userAgent: string;
  timestamp: Date;
}

const LoginLogSchema = new Schema<ILoginLog>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  ip: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<ILoginLog>("LoginLog", LoginLogSchema);
