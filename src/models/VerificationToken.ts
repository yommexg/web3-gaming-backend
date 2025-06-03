import mongoose, { Document, Schema } from "mongoose";
interface IVerificationToken extends Document {
  email: string;
  token: string;
  expiresAt: Date;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationTokenSchema = new Schema<IVerificationToken>(
  {
    email: {
      type: String,
      required: true,
    },

    token: {
      type: String,
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 60 * 1000),
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.VerificationToken ||
  mongoose.model<IVerificationToken>(
    "VerificationToken",
    VerificationTokenSchema
  );
