import mongoose, { Document, Schema } from "mongoose";

interface IForgetVerificationOTP extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const forgetverificationOTPSchema = new Schema<IForgetVerificationOTP>(
  {
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
  },
  { timestamps: true }
);

export default mongoose.model<IForgetVerificationOTP>(
  "ForgetVerificationOTP",
  forgetverificationOTPSchema
);
