import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import VerificationToken from "../models/VerificationToken";
import { JWT_SECRET } from "../config/env";

export const generateVerificationToken = async (email: string) => {
  const rawToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = await bcrypt.hash(rawToken, 10);

  await VerificationToken.findOneAndDelete({ email });

  await VerificationToken.create({
    email,
    token: hashedToken,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  return rawToken;
};

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "10s",
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "1d",
  });
};
