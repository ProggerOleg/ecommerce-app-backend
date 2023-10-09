import { PCategory } from "../models/product.category.model";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { validateMongoDBId } from "../utils/validateMongoDB_Id";

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
    try {
        const newCategory = await PCategory.create(req.body);
        res.json(newCategory);
    } catch (error: any) {
        throw new Error(error);
    }
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateMongoDBId(id);
    try {
        const updatedCategory = await PCategory.findByIdAndUpdate(id, req.body, {
            new: true
        });
        res.json(updatedCategory);
    } catch (error: any) {
        throw new Error(error);
    }
});


export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateMongoDBId(id);
    try {
        const deletedCategory = await PCategory.findByIdAndDelete(id, req.body);
        res.json(deletedCategory);
    } catch (error: any) {
        throw new Error(error);
    }
});

export const getCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const singleCategory = await PCategory.findById(id);
        res.json(singleCategory);
    } catch (error: any) {
        throw new Error(error);
    }
});

export const getAllCategory = asyncHandler(async (req: Request, res: Response) => {
    try {
        const allCategory = await PCategory.find();
        res.json(allCategory);
    } catch (error: any) {
        throw new Error(error);
    }
});