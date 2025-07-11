import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../../config/env";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken";
import User from "../../models/User";
import { generateDeviceId } from "../../utils/generateDeviceId";

interface MyJwtPayload extends JwtPayload {
  userId: string;
}

export const handleRefreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.body) {
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
    res.status(400).json({ success: false, message: "No Request Body found" });
    return;
  }

  const token = req.cookies?.refreshToken;
  const { fingerprint } = req.body;

  if (!fingerprint) {
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
    res.status(400).json({
      success: false,
      message: "No fingerprint found",
    });
    return;
  }

  //@ts-ignore
  const { ip = "unknown", userAgent = "unknown" } = req.metadata || {};
  const currentDeviceId = generateDeviceId(fingerprint, userAgent, ip);

  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as MyJwtPayload;

    if (!decoded?.userId) {
      res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
      res.status(403).json({ success: false, message: "Invalid Token" });
      return;
    }

    // Find user and check if device + token exist
    const user = await User.findOne({
      _id: decoded.userId,
      "refreshTokens.token": token,
      "refreshTokens.device.deviceId": currentDeviceId,
    });

    if (!user) {
      res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
      res
        .status(403)
        .json({ success: false, message: "Invalid Token or Device" });
      return;
    }

    const existingDeviceRefreshToken = user.refreshTokens.find((entry: any) => {
      return entry.device.deviceId === currentDeviceId;
    });

    const newRefreshToken = generateRefreshToken(user._id);
    const newAccessToken = generateAccessToken(user._id);

    existingDeviceRefreshToken.token = newRefreshToken;
    await user.save();

    // Send updated tokens
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.json({
      success: true,
      token: newAccessToken,
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
    res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
