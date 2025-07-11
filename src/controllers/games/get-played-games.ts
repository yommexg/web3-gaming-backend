import { Request, Response } from "express";
import Game from "../../models/Game";

export const handleGetPlayedGames = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    //@ts-ignore
    const userId = req.user.userId;

    const playedGames = await Game.find({
      players: userId,
      // status: { $in: ["finished"] },
    })
      .populate("creator", "username")
      .populate("winner", "username")
      .sort({ createdAt: -1 })
      .exec();

    const gamesData = playedGames.map((game) => ({
      id: game._id,
      title: game.title,
      type: game.type,
      image: game.image,
      status: game.status,
      startDate: game.startDate,
      creatorName: game.creator?.username,
      winnerName: game.winner?.username,
    }));

    res.status(200).json({ success: true, games: gamesData });
  } catch (error) {
    console.error("Error fetching played games:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
