import crypto from "crypto";
import VerificationToken from "../models/VerificationToken";

export const generateVerificationToken = async (email: string) => {
  const token = crypto.randomBytes(32).toString("hex");

  await VerificationToken.findOneAndDelete({ email }); // Invalidate old token

  await VerificationToken.create({
    email,
    token,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  });

  return token;
};
