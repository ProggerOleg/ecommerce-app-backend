import { Coupon } from "../models/coupon.model";
import { validateMongoDBId } from "../utils/validateMongoDB_Id";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";


export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    } catch (error: any) {
        throw new Error(error);
    }
});

export const getAllCoupons = asyncHandler(async (req: Request, res: Response) => {
    try {
        const allCoupons = await Coupon.find();
        res.json(allCoupons);
    } catch (error: any) {
        throw new Error(error);
    }
});

export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateMongoDBId(id);
    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedCoupon);
    } catch (error: any) {
        throw new Error(error);
    }
});

export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateMongoDBId(id);
    try {
        const deletedCoupon = await Coupon.findByIdAndDelete(id);
        res.json(deletedCoupon);
    } catch (error: any) {
        throw new Error(error);
    }
});