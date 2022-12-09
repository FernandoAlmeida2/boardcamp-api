import { Router } from "express";
import { getRentals, postRental } from "../controllers/rentals.controller.js";
import { rentalMiddleware } from "../middlewares/rental.middleware.js";

const router = Router();

router.get("/rentals", getRentals);

router.post("/rentals", rentalMiddleware, postRental);

export default router;
