import { Request, Response } from "express";
import User from "../../models/User";

export const handleGetUserDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    //@ts-ignore
    const userId = req.user.userId;

    const user = await User.findById(userId).exec();

    if (!user) {
      res.status(404).json({ success: false, message: "User Not Found" });
      return;
    }

    const userData = {
      id: user._id,
      email: user.email,
      username: user.username,
    };

    res.status(200).json({ success: true, user: userData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
