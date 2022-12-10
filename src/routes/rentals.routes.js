import { Router } from "express";
import { deleteRental, getRentals, postRental, postReturnRental } from "../controllers/rentals.controller.js";
import { rentalMiddleware } from "../middlewares/rental.middleware.js";

const router = Router();

router.get("/rentals", getRentals);

router.post("/rentals", rentalMiddleware, postRental);
router.post("/rentals/:id/return", postReturnRental);

router.delete("/rentals/:id", deleteRental);

export default router;
