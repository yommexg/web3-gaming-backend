import mongoose, { Schema, Document } from "mongoose";

interface ILoginVerificationOTP extends Document {
  user: mongoose.Types.ObjectId;
  otp: string;
  ip: string;
  userAgent: string;
  fingerprint: string;
  deviceId: string;
  expiresAt: Date;
}

const LoginVerificationOTPSchema = new Schema<ILoginVerificationOTP>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  otp: { type: String, required: true },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  fingerprint: { type: String, required: true },
  deviceId: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export default mongoose.model<ILoginVerificationOTP>(
  "LoginVerificationOTP",
  LoginVerificationOTPSchema
);
