import express from 'express';
import { addToWishlist, createProduct, deleteProduct, getAllProducts, getSingleProduct, ratingProduct, updateProduct } from '../controller/product.contoller';
import { isAdmin, authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createProduct);
router.get('/:id', getSingleProduct);
router.put('/wishlist', authMiddleware, addToWishlist);
router.put('/rating', authMiddleware, ratingProduct);

router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);
router.get('/', getAllProducts);

export { router as productRouter };