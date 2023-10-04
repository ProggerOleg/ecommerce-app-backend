import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware";
import { createCategory, deleteCategory, getAllCategory, getCategory, updateCategory } from "../controller/product.category.controller";

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createCategory);
router.get('/', getAllCategory);
router.put('/:id', authMiddleware, isAdmin, updateCategory);
router.delete('/:id', authMiddleware, isAdmin, deleteCategory);
router.get('/:id', getCategory);

export { router as categoryRouter };
