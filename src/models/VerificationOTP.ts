import mongoose, { Document, Schema } from "mongoose";

interface IVerificationOTP extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  isVerified: boolean;
}

const verificationOTPSchema = new Schema<IVerificationOTP>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 5 * 60 * 1000),
  },
});

export default mongoose.model<IVerificationOTP>(
  "VerificationOTP",
  verificationOTPSchema
);
