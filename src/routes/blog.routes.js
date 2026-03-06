import express from 'express';
import { createBlog, getBlogs, getBlogBySlug, updateBlog, deleteBlog } from '../controllers/blog.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createBlog);
router.get('/', getBlogs);
router.get("/:slug", getBlogBySlug);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);

export default router;