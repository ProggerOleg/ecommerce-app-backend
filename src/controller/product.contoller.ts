import { Product } from "../models/product.model";
import { Request, Response } from "express";
import asyncHandler from 'express-async-handler';

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    res.json({
        message: "Created new product"
    });
});