import express from "express";
import { authMiddleware, isAdmin } from "../middlewares/auth.middleware";
import { createBlog, deleteBlog, dislikeBlog, getAllBlogs, getBlog, likeBlog, updateBlog } from "../controller/blog.controller";

const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBlog);
router.put('/likes', authMiddleware, likeBlog);
router.put('/dislikes', authMiddleware, dislikeBlog);
router.put('/:id', authMiddleware, isAdmin, updateBlog);
router.delete('/:id', authMiddleware, isAdmin, deleteBlog);
router.get('/:id', getBlog);

router.get('/', getAllBlogs);

export { router as blogRouter };
