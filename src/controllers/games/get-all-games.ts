import { Request, Response } from "express";

import Game from "../../models/Game";

export const handleGetAllGames = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const games = await Game.find()
      .populate("creator", "username")
      .populate("players", "username")
      .populate("winner", "username");

    if (games.length === 0) {
      res.status(404).json({ success: false, message: "No Games Availiable" });
      return;
    }

    const gamesData = games.map((game) => ({
      id: game._id,
      title: game.title,
      type: game.type,
      image: game.image,
      status: game.status,
      startDate: game.startDate,
      playersCount: game.players.length,
      maxNumOfPlayers: game.maxNumOfPlayers,
      creatorName: game.creator?.username || null,
      winnerName: game.winner?.username || null,
      playersNames: game.players.map(
        (player: { username: string }) => player.username
      ),
    }));

    res.status(200).json({ success: true, games: gamesData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
