import { NextFunction, Request, Response } from "express";

// Not Found 
export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not Found : ${ req.originalUrl }`);
    res.status(404);
    next(error);
};

// Error Handler

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = (res.statusCode === 200) ? 403 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err?.message,
        stack: err?.stack
    });
};

module.exports = { errorHandler, notFound };