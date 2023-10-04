import { BCategory } from "../models/blog.category.model";
import asyncHandler from "express-async-handler";
import { validateMongoDBId } from "../utils/validateMongoDB_Id";

export const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await BCategory.create(req.body);
        res.json(newCategory);
    } catch (error: any) {
        throw new Error(error);
    }
});

export const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDBId(id);
    try {
        const updatedCategory = await BCategory.findByIdAndUpdate(id, req.body, {
            new: true
        });
        res.json(updatedCategory);
    } catch (error: any) {
        throw new Error(error);
    }
});


export const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDBId(id);
    try {
        const deletedCategory = await BCategory.findByIdAndDelete(id, req.body);
        res.json(deletedCategory);
    } catch (error: any) {
        throw new Error(error);
    }
});

export const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const singleCategory = await BCategory.findById(id);
        res.json(singleCategory);
    } catch (error: any) {
        throw new Error(error);
    }
});

export const getAllCategory = asyncHandler(async (req, res) => {
    console.log(' Zapros doshol ');
    try {
        const allCategory = await BCategory.find();
        res.json(allCategory);
    } catch (error: any) {
        throw new Error(error);
    }
});