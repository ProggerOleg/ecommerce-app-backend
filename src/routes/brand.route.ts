import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware";
import { createBrand, deleteBrand, getAllBrands, getBrand, updateBrand } from "../controller/brand.controller";

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBrand);
router.get('/', getAllBrands);
router.put('/:id', authMiddleware, isAdmin, updateBrand);
router.delete('/:id', authMiddleware, isAdmin, deleteBrand);
router.get('/:id', getBrand);

export { router as brandRouter };
