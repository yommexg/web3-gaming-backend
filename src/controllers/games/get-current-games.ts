import { Request, Response } from "express";
import Game from "../../models/Game";

export const handleGetCurrentGamesForUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    //@ts-ignore
    const userId = req.user.userId;

    const games = await Game.find({
      players: userId,
      status: { $in: ["open", "hosting"] },
    })
      .populate("creator", "username")
      .sort({ createdAt: -1 })
      .exec();

    const gamesData = games.map((game) => ({
      id: game._id,
      title: game.title,
      type: game.type,
      image: game.image,
      status: game.status,
      playersCount: game.players.length,
      maxNumOfPlayers: game.maxNumOfPlayers,
      creatorName: game.creator?.username,
    }));

    res.status(200).json({ success: true, games: gamesData });
  } catch (error) {
    console.error("Error fetching current games:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
