import { Request, Response } from "express";
import User from "../../models/User";
import Game from "../../models/Game";

export const handleGetUserDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // @ts-ignore
    const userId = req.user.userId;

    const user = await User.findById(userId).exec();

    if (!user) {
      res.status(404).json({ success: false, message: "User Not Found" });
      return;
    }

    // Fetch game statistics
    const [gamesPlayed, gamesHosted, gamesWon] = await Promise.all([
      Game.countDocuments({ players: userId, status: "finished" }),
      Game.countDocuments({ creator: userId, status: "finished" }),
      Game.countDocuments({ winner: userId }),
    ]);

    const userData = {
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl,
      bannerUrl: user.bannerUrl,
      bio: user.bio,
      XUrl: user.XUrl,
      discordUrl: user.discordUrl,
      websiteUrl: user.websiteUrl,
      games: {
        played: gamesPlayed,
        hosted: gamesHosted,
        wins: gamesWon,
      },
    };

    res.status(200).json({ success: true, user: userData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
