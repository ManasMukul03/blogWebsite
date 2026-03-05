import Blog from '../models/blog.model.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createBlog = asyncHandler(async (req, res) => {

    const { title, content, tags, coverImage } = req.body;

    if (!title || !content) {
        res.status(400);
        throw new Error("Title and content are required");
    }

    const blog = await Blog.create({
        title,
        content,
        tags,
        coverImage,
        author: req.user._id
    });

    res.status(201).json({
        message: "Blog created successfully",
        blog
    });

});

export const getBlogs = asyncHandler(async (req, res) => {

    const blogs = await Blog.find({ isPublished: true })
        .populate("author", "name email")
        .sort({ createdAt: -1 });

    res.status(200).json({
        count: blogs.length,
        blogs
    });

});

export const getBlogById = asyncHandler(async (req, res) => {

    const blog = await Blog.findById(req.params.id)
        .populate("author", "name email");

    if (!blog) {
        res.status(404);
        throw new Error("Blog not found");
    }

    res.status(200).json(blog);

});