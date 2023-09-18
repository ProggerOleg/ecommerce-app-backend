import { Request, Response } from "express";
import { User } from "../models/user.model";
import asyncHandler from 'express-async-handler';
import { generateToken } from "../config/jwtToken";
import { validateMongoDB } from "../../utils/validateMongoDB";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const email: string = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        // Create a new User
        const newUser = await User.create(req.body);
        console.log('New user was registered');
        res.json(newUser);
    } else {
        // User Already Exists
        throw new Error('User Already Exists');
    }
});

export const logginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    // Check if user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password)) {
        res.json({
            _id: findUser._id,
            firstname: findUser.firstname,
            lastname: findUser.lastname,
            email: findUser.email,
            mobile: findUser.mobile,
            isAdmin: findUser.isAdmin,
            token: generateToken(findUser?._id)
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error: any) {
        throw new Error(error);
    }
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateMongoDB(id);
    try {
        const lostUser = await User.findById(id);
        res.json(lostUser);
    } catch (e) {
        console.log((e as Error).message);//conversion to Error type
    }
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateMongoDB(id);
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        res.json(deletedUser);
    } catch (e) {
        console.log((e as Error).message);//conversion to Error type
    }
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { _id } = (req as any).user;
    validateMongoDB(_id);
    try {
        const updatedUser = await User.findByIdAndUpdate(_id, {
            firstname: req.body?.firstname,
            lastname: req.body?.lastname,
            email: req.body?.email,
            mobile: req.body?.mobile
        }, {
            new: true,
        });

        res.json(updatedUser);
    } catch (e) {
        console.log((e as Error).message);//conversion to Error type
    }
});

export const blockUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateMongoDB(id);
    try {
        const block = await User.findByIdAndUpdate(id, {
            isBlocked: true
        }, {
            new: true
        });
        res.json({
            message: "User Blocked"
        });
    } catch (error: any) {
        throw new Error(error);
    }
});

export const unblockUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateMongoDB(id);
    try {
        const unblock = await User.findByIdAndUpdate(id, {
            isBlocked: false
        }, {
            new: true
        });
        res.json({
            message: "User UnBlocked"
        });

    } catch (error: any) {
        throw new Error(error);
    }
});