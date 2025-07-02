import express from "express";

import { createUpload } from "../config/multer";
import { handleCreateGame } from "../controllers/games/create-game";
import { handleGetAllGames } from "../controllers/games/get-all-games";
import { handleGetCurrentGamesForUser } from "../controllers/games/get-current-games";
import { handleGetHostedGames } from "../controllers/games/get-hosted-games";
import { handleGetPlayedGames } from "../controllers/games/get-played-games";

const gameRouter = express.Router();

gameRouter.get("/all", handleGetAllGames);
gameRouter.get("/current", handleGetCurrentGamesForUser);
gameRouter.get("/hosted", handleGetHostedGames);
gameRouter.get("/played", handleGetPlayedGames);

gameRouter.post(
  "/create",
  createUpload({ maxFiles: 1, maxFileSize: 5 * 1024 * 1024 }).single("game"),
  handleCreateGame
);

export default gameRouter;
