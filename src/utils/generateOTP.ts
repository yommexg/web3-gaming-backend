import bcrypt from "bcryptjs";
import VerificationOTP from "../models/ForgetVerificationOTP";

export const generateOTPToken = async (email: string): Promise<string> => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

  const hashedOTP = await bcrypt.hash(otp, 10);

  await VerificationOTP.findOneAndDelete({ email });

  await VerificationOTP.create({
    email,
    otp: hashedOTP,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  });

  return otp;
};
