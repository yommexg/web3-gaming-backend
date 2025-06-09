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

    const user = await User.findById(decoded.userId);
    if (!user || !user.refreshTokens.includes(token)) {
      res.status(403).json({ success: false, message: "Invalid Token" });
      return;
    }

    // Remove old refresh token and add new one (rotation)
    user.refreshTokens = user.refreshTokens.filter((t: any) => t !== token);
    const newRefreshToken = generateRefreshToken(user._id);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id);

    // Set new refresh token cookie with longer expiration
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
    res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
