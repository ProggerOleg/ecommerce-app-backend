import { Deal } from "../models/deal.model";
import { Request, Response } from "express";
import asyncHandler from 'express-async-handler';

export const getSingleProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const findProduct = await Deal.findByPk(id);
        res.json(findProduct);
    } catch (error: any) {
        throw new Error(error);
    }
});

export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    try {
        const allProducts = await Deal.findAll();
        res.json(allProducts);
    } catch (error: any) {
        throw new Error(error);
    }
});
