import mongoose, { Document, Schema } from "mongoose";
import { TrustedDeviceSchema, ITrustedDevice } from "./TrustedDevice";

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  failedLoginAttempts?: number;
  lockUntil?: Date | null;
  refreshTokens: Array<{
    token: string;
    device: ITrustedDevice;
  }>;
  bio?: string | null;
  XUrl?: string | null;
  discordUrl?: string | null;
  websiteUrl?: string | null;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  trustedDevices?: ITrustedDevice[];
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    refreshTokens: [
      {
        token: { type: String, required: true },
        device: { type: TrustedDeviceSchema },
      },
    ],
    bio: { type: String, default: null },
    XUrl: { type: String, default: null },
    discordUrl: { type: String, default: null },
    websiteUrl: { type: String, default: null },
    avatarUrl: { type: String, default: null },
    bannerUrl: { type: String, default: null },
    trustedDevices: {
      type: [TrustedDeviceSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
