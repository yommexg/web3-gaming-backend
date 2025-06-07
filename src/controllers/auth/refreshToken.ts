import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../../config/env";
import { generateAccessToken } from "../../utils/generateToken";
import User from "../../models/User";

// Define your expected payload type
interface MyJwtPayload extends JwtPayload {
  userId: string;
}

export const handleRefreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "No refresh token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as MyJwtPayload;

    // Verify the token contains the expected payload
    if (!decoded?.userId) {
      res
        .status(403)
        .json({ success: false, message: "Invalid token payload" });
      return;
    }

    // Check if user still exists (hasn't been deleted or banned)
    const user = await User.findById(decoded.userId);
    if (!user) {
      res
        .status(404)
        .json({ success: false, message: "User no longer exists" });
      return;
    }

    // Generate a new access token
    const accessToken = generateAccessToken(user._id);

    res.json({
      success: true,
      token: accessToken,
    });
  } catch (err) {
    console.error("Error verifying refresh token:", err);
    res
      .status(403)
      .json({ success: false, message: "Invalid or expired refresh token" });
  }
};
