import { Router } from "express";
import { getCategories, postCategory } from "../controllers/categories.controller.js";
import { newCategoryMiddleware } from "../middlewares/category.middleware.js";

const router = Router();

router.get("/categories", getCategories);
router.post("/categories", newCategoryMiddleware, postCategory);

export default router;