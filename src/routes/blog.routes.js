import express from 'express';
import { createBlog, getBlogs, getBlogById } from '../controllers/blog.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createBlog);
router.get('/', getBlogs);
router.get('/:id', getBlogById);

export default router;