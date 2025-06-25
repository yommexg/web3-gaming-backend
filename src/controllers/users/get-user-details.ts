import { Response } from "express";
import User from "../../models/User";
import Game from "../../models/Game";
import { AuthenticatedRequest } from "../../types/req";

export const handleGetUserDetails = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).exec();

    if (!user) {
      res.status(404).json({ success: false, message: "User Not Found" });
      return;
    }

    // Fetch game statistics
    const [gamesPlayed, gamesHosted, gamesWon] = await Promise.all([
      Game.countDocuments({ players: userId }),
      Game.countDocuments({ creator: userId }),
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
