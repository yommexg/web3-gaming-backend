import crypto from "crypto";
import bcrypt from "bcryptjs";
import VerificationToken from "../models/VerificationToken";

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
