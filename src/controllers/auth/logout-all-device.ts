import { Request, Response } from "express";

import User from "../../models/User";

export const handleLogoutAll = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const userId = req.user.userId;

    await User.findByIdAndUpdate(userId, {
      $set: { refreshTokens: [] },
    });

    res.clearCookie("refreshToken");
    res.json({ success: true, message: "Logged out from all sessions" });
  } catch (err) {
    console.error("Logout all error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
