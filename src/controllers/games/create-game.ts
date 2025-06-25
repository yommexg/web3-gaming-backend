import { Response } from "express";

import Game from "../../models/Game";
import { uploadGameImage } from "../../utils/aws/game-image";
import { AuthenticatedRequest } from "../../types/req";

export const handleCreateGame = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.userId;

    if (!req.body) {
      res
        .status(400)
        .json({ success: false, message: "No Request Body found" });
      return;
    }

    const { title, maxNumOfPlayers, privacy, spectatorMode, type, startDate } =
      req.body;

    const file = req.file;

    if (!title || !maxNumOfPlayers || !type || !file) {
      res
        .status(400)
        .json({ success: false, message: "Missing or invalid game data." });
      return;
    }

    const existingGame = await Game.findOne({ title });

    if (existingGame) {
      res.status(400).json({
        success: false,
        message:
          "A game with this title already exists. Please choose a different title.",
      });
      return;
    }

    if (
      ![
        "pocker",
        "bingo",
        "agar",
        "game 04",
        "game 05",
        "game 06",
        "game 07",
        "game 08",
        "game 09",
        "game 10",
      ].includes(type)
    ) {
      res
        .status(400)
        .json({ success: false, message: "Game type not availiable" });
      return;
    }

    if (maxNumOfPlayers < 2) {
      res.status(400).json({
        success: false,
        message: "At least 2 players are required",
      });
      return;
    }

    if (
      spectatorMode !== undefined &&
      typeof spectatorMode !== "boolean" &&
      spectatorMode !== "true" &&
      spectatorMode !== "false"
    ) {
      res.status(400).json({
        success: false,
        message: "Spectator mode must be a boolean (true or false).",
      });
      return;
    }

    let resolvedStartDate: Date;
    let resolvedStatus: "open" | "hosting";

    if (startDate) {
      resolvedStartDate = new Date(startDate);

      if (resolvedStartDate > new Date()) {
        resolvedStatus = "open";
      } else {
        resolvedStatus = "hosting";
        resolvedStartDate = new Date();
      }
    } else {
      resolvedStartDate = new Date();
      resolvedStatus = "hosting";
    }

    const image = await uploadGameImage(file, title);

    await Game.create({
      title: title.toLowerCase(),
      image,
      creator: userId,
      players: [userId],
      maxNumOfPlayers,
      privacy: privacy.toLowerCase() || "public",
      spectatorMode: spectatorMode ?? false,
      type,
      status: resolvedStatus,
      startDate: resolvedStartDate,
    });

    res.status(201).json({
      success: true,
      message: "Game created successfully.",
    });
  } catch (error) {
    console.error("Error creating game:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error. Could not create game.",
    });
  }
};
