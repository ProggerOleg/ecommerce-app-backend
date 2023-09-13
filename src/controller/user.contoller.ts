import { Request, Response } from "express";

const User = require('../models/user.model');
const asyncHandler = require('express-async-handler');

const createUser = asyncHandler(async (req: Request, res: Response) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        // Create a new User
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        // User Already Exists
        throw new Error('User Already Exists');
    }
});

module.exports = { createUser };