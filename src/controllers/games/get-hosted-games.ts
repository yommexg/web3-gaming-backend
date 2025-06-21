import { Request, Response } from "express";
import mongoose from "mongoose";
import Game from "../../models/Game";

export const handleGetHostedGames = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    //@ts-ignore
    const userId = req.user.userId;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const hostedGames = await Game.find({
      creator: userObjectId,
    })
      .sort({ createdAt: -1 })
      .exec();

    const gamesData = hostedGames.map((game) => ({
      id: game._id,
      title: game.title,
      type: game.type,
      image: game.image,
      status: game.status,
      startDate: game.startDate,
      winnerName: game.winner?.username,
    }));

    res.status(200).json({ success: true, games: gamesData });
  } catch (error) {
    console.error("Error fetching hosted games:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
