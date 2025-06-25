import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../../config/env";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken";
import User from "../../models/User";

interface MyJwtPayload extends JwtPayload {
  userId: string;
}

export const handleRefreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as MyJwtPayload;

    if (!decoded?.userId) {
      res.status(403).json({ success: false, message: "Invalid Token" });
      return;
    }

    // Match by nested token
    const user = await User.findOne({
      _id: decoded.userId,
      "refreshTokens.token": token,
    });

    if (!user) {
      res.status(403).json({ success: false, message: "Invalid Token" });
      return;
    }

    const userRefreshTokens = user.refreshTokens || [];

    // Trim to last 5
    if (userRefreshTokens.length >= 5) {
      userRefreshTokens.sort((a: any, b: any) => {
        return (
          new Date(a.device?.addedAt).getTime() -
          new Date(b.device?.addedAt).getTime()
        );
      });
      userRefreshTokens.shift();
    }

    const newRefreshToken = generateRefreshToken(user._id);

    const newDevice = {
      //@ts-ignore
      ip: req.metadata?.ip || "unknown",
      deviceId: req.headers["x-device-id"]?.toString() || "unknown",
      fingerprint: req.headers["x-fingerprint"]?.toString() || "unknown",
      //@ts-ignore
      userAgent: req.metadata?.userAgent || "unknown",
      addedAt: new Date(),
    };

    user.refreshTokens.push({
      token: newRefreshToken,
      device: newDevice,
    });

    await user.save();

    const newAccessToken = generateAccessToken(user._id);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    res.json({
      success: true,
      token: newAccessToken,
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
