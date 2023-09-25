import { Product } from "../models/product.model";
import { Request, Response } from "express";
import asyncHandler from 'express-async-handler';
import slugify from "slugify";

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (error: any) {
        throw new Error(error);
    }
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
            new: true
        });
        res.json(updateProduct);
    } catch (error: any) {
        throw new Error(error);
    }
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deleteProduct = await Product.findByIdAndDelete(id);
        res.json(deleteProduct);
    } catch (error: any) {
        throw new Error(error);
    }
});

export const getSingleProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (error: any) {
        throw new Error(error);
    }
});

export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    try {
        const queryObj = { ...req.query };
        const exludeFields = [ 'page', 'sort', 'limit', 'fields' ];
        exludeFields.forEach(elem => delete queryObj[ elem ]);
        console.log(queryObj);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${ match }`);
        console.log(JSON.parse(queryStr));
        const allProducts = await Product.find(queryObj);
        res.json(allProducts[ 0 ] ? allProducts : { error: "No products with such criteria found" });
    } catch (error: any) {
        throw new Error(error);
    }
});

