import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import VerificationToken from "../../models/VerificationToken";
import User from "../../models/User";

export const handleVerifyEmailToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    res.status(400).json({ success: false, message: "Token is required" });
    return;
  }

  try {
    const record = await VerificationToken.findOne({});

    if (!record) {
      res
        .status(404)
        .json({ success: false, message: "Invalid or expired token" });
      return;
    }

    if (record.expiresAt < new Date()) {
      await VerificationToken.deleteOne({ _id: record._id }); // Clean up
      res.status(410).json({ success: false, message: "Token expired" });
      return;
    }

    const isMatch = await bcrypt.compare(token, record.token);
    if (!isMatch) {
      res.status(403).json({ success: false, message: "Invalid token" });
      return;
    }

    const existingUser = await User.findOne({ email: record.email });
    if (existingUser) {
      res
        .status(409)
        .json({ success: false, message: "User already verified" });
      return;
    }

    record.token = "";
    record.isVerified = true;
    await record.save();

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
