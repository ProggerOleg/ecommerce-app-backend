import { Blog } from "../models/blog.model";
import { Request, Response } from "express";
import asyncHandler from 'express-async-handler';
import { validateMongoDBId } from "../utils/validateMongoDB_Id";


export const createBlog = asyncHandler(async (req: Request, res: Response) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    } catch (error: any) {
        throw new Error(error);
    }
});

export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateMongoDBId(id);
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true
        });
        res.json(updatedBlog);
    } catch (error: any) {
        throw new Error(error);
    }
});


export const getBlog = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateMongoDBId(id);
    try {
        const getBlog = await Blog.findById(id)
            .populate("likes")
            .populate('dislikes');

        await Blog.findByIdAndUpdate(id, {
            $inc: { numViews: 1 },
        },
            { new: true }
        );
        res.json(getBlog);
    } catch (error: any) {
        throw new Error(error);
    }
});


export const getAllBlogs = asyncHandler(async (req: Request, res: Response) => {
    try {
        const allBlogs = await Blog.find();
        res.json(allBlogs);
    } catch (error: any) {
        throw new Error(error);
    }
});


export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateMongoDBId(id);
    try {
        const deletedBlog = await Blog.findByIdAndDelete(id);
        res.json(deletedBlog);
    } catch (error: any) {
        throw new Error(error);
    }
});

export const likeBlog = asyncHandler(async (req: Request, res: Response) => {
    const { blogId } = req.body;
    validateMongoDBId(blogId);
    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // find the login user
    const loginUserId = (req as any)?.user?._id;
    // find if the user has liked the blog
    const isLiked = blog?.isLiked;
    // find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes?.find(
        (userId: any) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { dislikes: loginUserId },
                isDisliked: false,
            },
            { new: true }
        );
        res.json(blog);
    }
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserId },
                isLiked: false,
            },
            { new: true }
        );
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { likes: loginUserId },
                isLiked: true,
            },
            { new: true }
        );
        res.json(blog);
    }
});
export const dislikeBlog = asyncHandler(async (req: Request, res: Response) => {
    const { blogId } = req.body;
    validateMongoDBId(blogId);
    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // find the login user
    const loginUserId = (req as any)?.user?._id;
    // find if the user has liked the blog
    const isDisLiked = blog?.isDisliked;
    // find if the user has disliked the blog
    const alreadyLiked = blog?.likes?.find(
        (userId: any) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { likes: loginUserId },
                isLiked: false,
            },
            { new: true }
        );
        res.json(blog);
    }
    if (isDisLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: { dislikes: loginUserId },
                isDisliked: false,
            },
            { new: true }
        );
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: { dislikes: loginUserId },
                isDisliked: true,
            },
            { new: true }
        );
        res.json(blog);
    }
});
