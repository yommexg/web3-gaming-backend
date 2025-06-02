import mongoose, { Document, Schema } from "mongoose";

export interface IVerificationToken extends Document {
  email: string;
  token: string;
  expiresAt: Date;
}

const VerificationTokenSchema = new Schema<IVerificationToken>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  token: {
    type: String,
    required: true,
  },

  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 3600000),
  },
});

export default mongoose.models.VerificationToken ||
  mongoose.model<IVerificationToken>(
    "VerificationToken",
    VerificationTokenSchema
  );
