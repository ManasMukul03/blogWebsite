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

const router = express.Router();

router.post('/', protect, createBlog);

router.get('/', getBlogs);

router.get("/trending", getTrendingBlogs);

router.get("/bookmarks", protect, getBookmarks);

router.get("/:slug", getBlogBySlug);

router.put('/:id', protect, updateBlog);

router.delete('/:id', protect, deleteBlog);

router.post("/:id/like", protect, toggleLike);

router.post("/:id/bookmark", protect, toggleBookmark);

export default router;