import { Request, Response } from "express";
import mongoose from "mongoose";

import Game from "../../models/Game";

export const handleGetIndividualGames = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { gameId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      res.status(400).json({ success: false, message: "Invalid Game ID" });
      return;
    }

    const game = await Game.findById(gameId)
      .populate("creator", "username")
      .populate("players", "username")
      .populate("winner", "username");

    if (!game) {
      res
        .status(404)
        .json({ success: false, message: "This game is not availiable" });
      return;
    }

    const gameData = {
      title: game.title,
      type: game.type,
      image: game.image,
      status: game.status,
      playersCount: game.players.length,
      maxNumOfPlayers: game.maxNumOfPlayers,
      creatorName: game.creator?.username || null,
      winnerName: game.winner?.username || null,
      playersNames: game.players.map(
        (player: { username: string }) => player.username
      ),
      currentRound: game.currentRound.number ?? 1,
      // startDate: game.currentRound.startDate,
      startDate: game.startDate,
      rounds: game.rounds.map((round: any) => ({
        status: round.status,
        number: round.number,
      })),
    };
    res.status(200).json({ success: true, game: gameData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
