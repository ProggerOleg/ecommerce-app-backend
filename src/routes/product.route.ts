import express from 'express';
import { addToWishlist, createProduct, deleteProduct, getAllProducts, getSingleProduct, ratingProduct, updateProduct, uploadImages } from '../controller/product.contoller';
import { isAdmin, authMiddleware } from '../middlewares/auth.middleware';
import { productImgResize, uploadPhoto } from '../middlewares/uploadImages.middleware';

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createProduct);
router.put(
    '/upload/:id',
    authMiddleware,
    isAdmin,
    uploadPhoto.array('images', 10),
    productImgResize,
    uploadImages);
router.get('/:id', getSingleProduct);
router.put('/wishlist', authMiddleware, addToWishlist);
router.put('/rating', authMiddleware, ratingProduct);

router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);
router.get('/', getAllProducts);

export { router as productRouter };