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

        // Filtering
        const queryObj = { ...req.query };
        const exludeFields = [ 'page', 'sort', 'limit', 'fields' ];
        exludeFields.forEach(elem => delete queryObj[ elem ]);
        console.log(queryObj);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${ match }`);

        let query: any = Product.find(JSON.parse(queryStr));


        // Sorting
        if (req.query.sort && typeof req.query.sort === "string") {
            const sortBy = req.query.sort.split(',').join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Limiting the fields
        if (req.query.fields && typeof req.query.fields === "string") {
            const fields = req.query.fields.split(',').join(" ");
            query = query.select(fields);
        } else {
            query.select('-__v');
        }

        // Pagination
        const page: number = Number(req.query.page);
        const limit: number = Number(req.query.limit);
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error("This page doesn't exist");
        }

        const product = await query;
        res.json(product[ 0 ] ? product : { error: "No products with such criteria found" });
    } catch (error: any) {
        throw new Error(error);
    }
});

