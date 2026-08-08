import express from 'express';
import {
    createBlog,
    getBlogs,
    getBlogBySlug,
    updateBlog,
    deleteBlog,
    toggleLike,
    getTrendingBlogs,
    toggleBookmark,
    getBookmarks
} from '../controllers/blog.controller.js';

import protect from '../middleware/auth.middleware.js';
import cache from '../middleware/cache.middleware.js';
import { createBlogValidator, updateBlogValidator } from '../validators/blog.validator.js';
import validate from '../middleware/validate.middleware.js';

const router = express.Router();

router.post('/', protect, createBlogValidator, validate, createBlog);

router.get('/', cache('blogs', 60), getBlogs);

router.get("/trending", cache('trending', 300), getTrendingBlogs);

router.get("/bookmarks", protect, getBookmarks);

router.get("/:slug", getBlogBySlug);

router.put('/:id', protect, updateBlogValidator, validate, updateBlog);

router.delete('/:id', protect, deleteBlog);

router.post("/:id/like", protect, toggleLike);

router.post("/:id/bookmark", protect, toggleBookmark);

export default router;