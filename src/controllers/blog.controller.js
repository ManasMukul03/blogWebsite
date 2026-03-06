import Blog from '../models/blog.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import slugify from "slugify";

export const createBlog = asyncHandler(async (req, res) => {

    const { title, content, tags, coverImage } = req.body;

    if (!title || !content) {
        res.status(400);
        throw new Error("Title and content are required");
    }

    const slug = slugify(title, { lower: true });

    const blog = await Blog.create({
        title,
        content,
        slug,
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

export const getBlogBySlug = asyncHandler(async (req, res) => {

    const blog = await Blog.findOne({ slug: req.params.slug })
        .populate("author", "name email");

    if (!blog) {
        res.status(404);
        throw new Error("Blog not found");
    }

    res.status(200).json(blog);

});


export const updateBlog = asyncHandler(async (req, res) => {

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        res.status(404);
        throw new Error("Blog not found");
    }

    // Authorization check
    if (blog.author.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to update this blog");
    }

    const { title, content, tags, coverImage, isPublished } = req.body;

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tags || blog.tags;
    blog.coverImage = coverImage || blog.coverImage;
    blog.isPublished = isPublished ?? blog.isPublished;

    const updatedBlog = await blog.save();

    res.status(200).json({
        message: "Blog updated successfully",
        blog: updatedBlog
    });

});

export const deleteBlog = asyncHandler(async (req, res) => {

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        res.status(404);
        throw new Error("Blog not found");
    }

    // Authorization check
    if (blog.author.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to delete this blog");
    }

    await blog.deleteOne();

    res.status(200).json({
        message: "Blog deleted successfully"
    });

});



