import jwt from "jsonwebtoken";
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";

export const authMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    if (req?.headers?.authorization?.startsWith('Bearer')) {
        let token: string = req.headers.authorization.split(" ")[ 1 ];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
                const user = await User.findByPk(decoded?.id);
                (req as any).user = user;
                next();
            }
        } catch (error) {
            throw new Error('Not Authorized token expired, please login again');
        }
    } else {
        throw new Error('There is no token attached to header');
    }
});
