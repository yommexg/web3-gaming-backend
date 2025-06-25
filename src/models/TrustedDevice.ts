import { Schema } from "mongoose";

export interface ITrustedDevice {
  ip: string;
  deviceId: string;
  userAgent: string;
  fingerprint: string;
  addedAt: Date;
}

export const TrustedDeviceSchema = new Schema<ITrustedDevice>(
  {
    ip: { type: String, required: true },
    deviceId: { type: String, required: true },
    userAgent: { type: String, required: true },
    fingerprint: { type: String, required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);
