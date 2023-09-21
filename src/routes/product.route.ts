import express from 'express';
import { createProduct } from '../controller/product.contoller';

const router = express.Router();
router.post('/', createProduct);

export { router as productRouter };