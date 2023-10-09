import { Brands } from "../models/brand.model";
import { Request, Response } from "express";
import asyncHandler from 'express-async-handler';
import { validateMongoDBId } from "../utils/validateMongoDB_Id";


export const createBrand = asyncHandler(async (req: Request, res: Response) => {
    try {
        const newBrand = await Brands.create(req.body);
        res.json(newBrand);
    } catch (error: any) {
        throw new Error(error);
    }
});

export const updateBrand = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateMongoDBId(id);
    try {
        const updatedBrand = await Brands.findByIdAndUpdate(id, req.body, {
            new: true
        });
        res.json(updatedBrand);
    } catch (error: any) {
        throw new Error(error);
    }
});


export const getBrand = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateMongoDBId(id);
    try {
        const getBrand = await Brands.findById(id)
            .populate("likes")
            .populate('dislikes');

        await Brands.findByIdAndUpdate(id, {
            $inc: { numViews: 1 },
        },
            { new: true }
        );
        res.json(getBrand);
    } catch (error: any) {
        throw new Error(error);
    }
});


export const getAllBrands = asyncHandler(async (req: Request, res: Response) => {
    try {
        const allBrands = await Brands.find();
        res.json(allBrands);
    } catch (error: any) {
        throw new Error(error);
    }
});


export const deleteBrand = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateMongoDBId(id);
    try {
        const deletedBrand = await Brands.findByIdAndDelete(id);
        res.json(deletedBrand);
    } catch (error: any) {
        throw new Error(error);
    }
});
