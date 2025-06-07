import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "../../models/User";
import LoginLog from "../../models/LoginLog";
import { sendNewDeviceNotification } from "../../utils/email/sendNewDeviceNotification";
import LoginVerificationOTP from "../../models/LoginVerificationOTP";
import { sendNewDeviceOTP } from "../../utils/email/sendNewDeviceOTP";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MINUTES = 15;

export const handleLoginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.body) {
    res.status(400).json({ success: false, message: "No Request Body found" });
    return;
  }

  const { email, password } = req.body;

  //@ts-ignore
  const { ip = "unknown", userAgent = "unknown" } = req.metadata || {};

  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      await delayResponse();
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    if (
      user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS &&
      user.lockUntil > new Date()
    ) {
      res.status(423).json({
        success: false,
        message: "Account temporarily locked. Try again later.",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Increment failed login attempts
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME_MINUTES * 60 * 1000);
      }
      await user.save();
      await delayResponse();
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    // Reset failed login attempts
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const existingLogin = await LoginLog.findOne({
      user: user._id,
      ip,
      userAgent,
    });

    if (!existingLogin) {
      await LoginVerificationOTP.findOneAndDelete({ user: user._id });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const hashedOTP = await bcrypt.hash(otp, 10);

      await LoginVerificationOTP.create({
        user: user._id,
        otp: hashedOTP,
        ip,
        userAgent,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });

      await sendNewDeviceOTP(user.email, otp, ip, userAgent);

      res.status(202).json({
        success: false,
        otpRequired: true,
        message:
          "New device detected. Please verify the OTP sent to your email.",
      });
      return;
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const handleVerifyNewDeviceAndLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.body) {
    res.status(400).json({ success: false, message: "No Request Body found" });
    return;
  }

  const { email, otp } = req.body;

  //@ts-ignore
  const { ip = "unknown", userAgent = "unknown" } = req.metadata || {};

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const record = await LoginVerificationOTP.findOne({
      user: user._id,
      ip,
      userAgent,
    });

    if (!record || record.expiresAt < new Date()) {
      res
        .status(403)
        .json({ success: false, message: "Invalid or expired OTP" });
      return;
    }

    const isMatch = await bcrypt.compare(otp, record.otp);

    if (!isMatch) {
      res.status(403).json({ success: false, message: "Invalid OTP" });
      return;
    }

    // Clean up
    await LoginVerificationOTP.deleteOne({ _id: record._id });

    // Log device
    await LoginLog.create({ user: user._id, ip, userAgent });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await sendNewDeviceNotification(user.email, ip, userAgent);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // secure: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

function delayResponse(ms: number = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
