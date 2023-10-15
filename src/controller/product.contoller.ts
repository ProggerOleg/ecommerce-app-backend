import { Product } from "../models/product.model";
import { Request, Response } from "express";
import asyncHandler from 'express-async-handler';
import slugify from "slugify";
import { User } from "../models/user.model";
import { validateMongoDBId } from "../utils/validateMongoDB_Id";
import fs from 'fs';
import { cloudinaryUploadImg } from "../utils/cloudinary";


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

export const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
    const { _id } = (req as any).user;
    const { prodId } = req.body;
    try {
        const user = await User.findById(_id);
        const alreadyAdded = (user as any).wishlist.find(
            (id: any) => id.toString() === prodId);
        if (alreadyAdded) {
            let user = await User.findByIdAndUpdate(_id, {
                $pull: { wishlist: prodId }
            }, { new: true });
            res.json(user);
        } else {
            let user = await User.findByIdAndUpdate(_id, {
                $push: { wishlist: prodId }
            }, { new: true });
            res.json(user);
        }
    } catch (error: any) {
        throw new Error(error);
    }
});


export const ratingProduct = asyncHandler(async (req: Request, res: Response) => {
    const { _id } = (req as any).user;
    const { star, prodId, comment } = req.body;
    try {
        const product = await Product.findById(prodId);
        let alreadyRated = product?.ratings.find(
            (userId: any) => userId.postedby.toString() === _id.toString()
        );
        console.log(alreadyRated);
        if (alreadyRated) {
            const updateRating = await Product.updateOne(
                {
                    ratings: { $elemMatch: alreadyRated },
                },
                {
                    $set: { "ratings.$.star": star, "ratings.$.comment": comment },
                },
                {
                    new: true,
                }
            );
        } else {
            const rateProduct = await Product.findByIdAndUpdate(
                prodId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedby: _id,
                        },
                    },
                },
                {
                    new: true,
                }
            );
        }
        const getallratings = await Product.findById(prodId);
        let totalRating = getallratings?.ratings.length;
        let ratingsum = getallratings?.ratings
            .map((item: any) => item.star)
            .reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingsum / totalRating!);
        let finalproduct = await Product.findByIdAndUpdate(
            prodId,
            {
                totalratings: actualRating,
            },
            { new: true }
        );
        res.json(finalproduct);
    } catch (error: any) {
        throw new Error(error);
    }
});

export const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDBId(id);
    try {
        console.log(req.files);
        const uploader = (path: string) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for (const file of (files as any)) {
            const { path } = file;
            console.log(path);
            const newpath = await uploader(path);
            console.log(newpath);
            urls.push(newpath);
        }
        const findProduct = await Product.findByIdAndUpdate(
            id,
            {
                images: urls.map((file) => {
                    return file;
                }),
            },
            {
                new: true,
            }
        );
        res.json(findProduct);
    } catch (error: any) {
        throw new Error(error);
    }
});
