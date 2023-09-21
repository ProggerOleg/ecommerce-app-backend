import { Request, Response } from "express";
import { User } from "../models/user.model";
import asyncHandler from 'express-async-handler';
import { generateToken } from "../config/jwtToken";
import { validateMongoDB } from "../../utils/validateMongoDB";
import { generateRefreshToken } from "../config/refreshToken";
import jwt, { JwtPayload, Secret, VerifyOptions } from "jsonwebtoken";

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
        const refreshToken = await generateRefreshToken(findUser?.id);
        const updateUser = await User.findByIdAndUpdate(findUser._id, {
            refreshToken: refreshToken
        }, { new: true }
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
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

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No refresh token in cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        });
        res.sendStatus(204); //Forbidden operation
    }
    await User.findOneAndUpdate({ refreshToken }, {
        refreshToken: "",
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204);
});

export const handleRefreshToken = asyncHandler(async (req: Request, res: Response) => {
    const cookie = req.cookies;
    if (!cookie.refreshToken) throw new Error("No refresh token in cookies");
    const refreshToken: string = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("No Refresh token present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET as Secret, (err, decoded) => {
        if (err) {
            throw new Error('There is something wrong with the refresh token');
        }
        const jwtPayload = decoded as JwtPayload;

        if (user.id !== jwtPayload.id) {
            throw new Error('The user ID in the token does not match');
        }
        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    });
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