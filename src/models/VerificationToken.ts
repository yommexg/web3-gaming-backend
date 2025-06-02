import mongoose, { Document, Schema } from "mongoose";

export interface IVerificationToken extends Document {
  email: string;
  token: string;
  expiresAt: Date;
  isVerified: boolean;
}

const VerificationTokenSchema = new Schema<IVerificationToken>({
  email: {
    type: String,
    required: true,
  },

  token: {
    type: String,
  },

  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 3 * 60 * 1000),
  },

  isVerified: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.VerificationToken ||
  mongoose.model<IVerificationToken>(
    "VerificationToken",
    VerificationTokenSchema
  );
