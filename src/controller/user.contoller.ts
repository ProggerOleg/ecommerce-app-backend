import { Request, Response } from "express";
import { User } from "../models/user.model";
import asyncHandler from 'express-async-handler';
import { generateToken } from "../config/jwtToken";
import { generateRefreshToken } from "../config/refreshToken";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { sendEmailMiddleware } from "./email.controller";
import crypto from "crypto";


export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const email: string = req.body.email;
    const findUser = await User.findOne({ where: { email } });
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
    // Check if user exists or not;
    const findUser = await User.findOne({ where: { email } });
    if (findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(`${ findUser.dataValues.id }`);

        const updateUser = await User.findOne({ where: { id: findUser.dataValues.id } });
        updateUser?.update({
            refreshToken: refreshToken
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            id: findUser.dataValues.id,
            firstname: findUser.dataValues.name,
            email: findUser.dataValues.email,
            token: generateToken(`${ findUser?.dataValues.id }`)
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No refresh token in cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ where: { refreshToken } });
    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        });
        res.sendStatus(204); //Forbidden operation
    }
    const userRefresh = await user?.update({
        refreshToken: "",
    });
    await userRefresh?.save();
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(200);
});

export const handleRefreshToken = asyncHandler(async (req: Request, res: Response) => {
    const cookie = req.cookies;
    if (!cookie.refreshToken) throw new Error("No refresh token in cookies");
    const refreshToken: string = cookie.refreshToken;
    const user = await User.findOne({ where: { refreshToken } });
    if (!user) throw new Error("No Refresh token present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET as Secret, (err, decoded) => {
        if (err) {
            throw new Error('There is something wrong with the refresh token');
        }
        const jwtPayload = decoded as JwtPayload;

        if (user.id !== jwtPayload.id) {
            throw new Error('The user ID in the token does not match');
        }
        const accessToken = generateToken(`${ user?.id }`);
        res.json({ accessToken });
    });
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const lostUser = await User.findByPk(id);
        res.json(lostUser);
    } catch (e) {
        console.log((e as Error).message);//conversion to Error type
    }
});



export const updatePassword = asyncHandler(async (req: Request, res: Response) => {
    const { id }: { id: string; } = (req as any).user;
    const { password } = req.body;
    const user = await User.findByPk(id);
    if (user && password) {
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    } else {
        res.json(user);
    }
});

export const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("User not found with this email");
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please follow this link to reset your password. This link is valid till 10 minutes from now. <a href='http://localhost:3000/reset-password/${ token }'>Click here</a>`;
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            html: resetURL
        };
        sendEmailMiddleware(data, req, res);
        res.json({ message: 'Email sent successfully' });
    } catch (error: any) {
        throw new Error(error);
    }
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest("hex");
    const user = await User.findOne({
        where: {
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        }
    });
    if (!user) throw new Error("Token Expired, please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});