import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../../config/env";
import User from "../../models/User";

interface MyJwtPayload extends JwtPayload {
  userId: string;
}

export const handleLogout = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    res.sendStatus(204);
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as MyJwtPayload;
    const user = await User.findById(decoded.userId);
    if (user) {
      user.refreshTokens = user.refreshTokens.filter((t: any) => t !== token);
      await user.save();
    }

    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
    res.status(200).json({ success: true, message: "Logged out" });
  } catch (err) {
    res.clearCookie("refreshToken");
    res.status(204).end();
  }
};
