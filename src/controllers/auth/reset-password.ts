import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../../models/User";
import VerificationOTP from "../../models/VerificationOTP";
import { isEmailValid, isPasswordValid } from "../../utils/regex";

export const handleResetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.body) {
    res.status(400).json({ success: false, message: "No Request Body found" });
    return;
  }

  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    res
      .status(400)
      .json({ success: false, message: "Email and new password required" });
    return;
  }

  if (!isEmailValid(email)) {
    res.status(400).json({ success: false, message: "Invalid Email" });
    return;
  }

  if (!isPasswordValid(newPassword)) {
    res.status(400).json({ success: false, message: "Weak Password" });
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const otpRecord = await VerificationOTP.findOne({ email });

    if (!otpRecord || !otpRecord.isVerified) {
      res.status(400).json({ success: false, message: "OTP not verified" });
      return;
    }

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (otpRecord.updatedAt < fiveMinutesAgo) {
      await VerificationOTP.deleteOne({ email });
      res.status(403).json({
        success: false,
        message: "Verification expired. Please verify again.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    await VerificationOTP.deleteOne({ email });

    res.status(200).json({ success: true, message: "Password has been reset" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to reset password" });
  }
};
