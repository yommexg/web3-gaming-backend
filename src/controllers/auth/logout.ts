import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../../config/env";
import User from "../../models/User";
import { generateDeviceId } from "../../utils/generateDeviceId";

interface MyJwtPayload extends JwtPayload {
  userId: string;
}

export const handleLogout = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.cookies?.refreshToken;

  if (!req.body) {
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
    res.sendStatus(204);
    return;
  }

  const { fingerprint } = req.body;

  //@ts-ignore
  const { ip = "unknown", userAgent = "unknown" } = req.metadata || {};
  const currentDeviceId = generateDeviceId(fingerprint, userAgent, ip);

  if (!token || !fingerprint) {
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
    res.sendStatus(204);
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as MyJwtPayload;

    if (!decoded?.userId) {
      res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
      res.status(403).json({ success: false, message: "Invalid token" });
      return;
    }

    const user = await User.findById(decoded.userId);
    if (user) {
      // Remove token only for current device
      user.refreshTokens = user.refreshTokens.filter((entry: any) => {
        return (
          entry.token !== token || entry.device?.deviceId !== currentDeviceId
        );
      });
      await user.save();
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ success: true, message: "Logged out from device" });
  } catch (err) {
    console.error("Logout Error:", err);
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
    });
    res.status(204).end(); // Graceful fallback
  }
};
