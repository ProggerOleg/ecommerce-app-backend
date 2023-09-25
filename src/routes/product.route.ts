import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getSingleProduct, updateProduct } from '../controller/product.contoller';
import { isAdmin, authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createProduct);
router.get('/:id', getSingleProduct);
router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);
router.get('/', getAllProducts);

export { router as productRouter };