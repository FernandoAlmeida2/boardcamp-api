import { Router } from "express";
import { getGames, postGame } from "../controllers/games.controller.js";
import { newGameMiddleware } from "../middlewares/game.middleware.js";

const router = Router();

router.get("/games", getGames);
router.post("/games", newGameMiddleware, postGame);

export default router;