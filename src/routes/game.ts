import express from "express";

import { createUpload } from "../config/multer";
import { handleCreateGame } from "../controllers/games/create-game";
import { handleGetAllGames } from "../controllers/games/get-all-games";

const gameRouter = express.Router();

gameRouter.get("/all", handleGetAllGames);

gameRouter.post(
  "/create",
  createUpload({ maxFiles: 2, maxFileSize: 5 * 1024 * 1024 }).single("game"),
  handleCreateGame
);

export default gameRouter;
