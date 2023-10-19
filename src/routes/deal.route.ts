import express from 'express';
import { getAllProducts, getSingleProduct } from '../controller/deal.contoller';

const router = express.Router();

router.get('/:id', getSingleProduct);
router.get('/', getAllProducts);

export { router as productRouter };