import User from "../models/user.model.js";
import Blog from '../models/blog.model.js';
import Comment from '../models/comment.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import slugify from "slugify";
import { clearCacheByPrefix } from '../utils/clearCache.js';

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Appends -2, -3, ... until the slug is free (ignoring the blog being updated).
const generateUniqueSlug = async (title, excludeId = null) => {
    const base = slugify(title, { lower: true, strict: true }) || 'post';

    let slug = base;
    let counter = 1;

    while (await Blog.exists({ slug, _id: { $ne: excludeId } })) {
        counter += 1;
        slug = `${base}-${counter}`;
    }

    return slug;
};

export const createBlog = asyncHandler(async (req, res) => {

    const { title, content, tags, coverImage } = req.body;

    if (!title || !content) {
        res.status(400);
        throw new Error("Title and content are required");
    }

    const slug = await generateUniqueSlug(title);

    const blog = await Blog.create({
        title,
        content,
        slug,
        tags,
        coverImage,
        author: req.user._id
    });

    await clearCacheByPrefix('blogs');
    await clearCacheByPrefix('trending');

    res.status(201).json({
        message: "Blog created successfully",
        blog
    });

});

export const getBlogs = asyncHandler(async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const search = escapeRegex(String(req.query.search || ""));

    const filter = {
        isPublished: true,
        $or: [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } }
        ]
    };

    const blogs = await Blog.find(filter)
        .populate("author", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalBlogs = await Blog.countDocuments(filter);

    res.status(200).json({
        page,
        totalPages: Math.ceil(totalBlogs / limit),
        totalBlogs,
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

    blog.views+=1;
    await blog.save();

    // req.user is set by optionalAuth when the request carries a valid token
    const isBookmarked = Boolean(
        req.user?.bookmarks.some(id => id.toString() === blog._id.toString())
    );

    res.status(200).json({ ...blog.toObject(), isBookmarked });

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

    if (title && title !== blog.title) {
        blog.slug = await generateUniqueSlug(title, blog._id);
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tags || blog.tags;
    blog.coverImage = coverImage || blog.coverImage;
    blog.isPublished = isPublished ?? blog.isPublished;

    const updatedBlog = await blog.save();

    await clearCacheByPrefix('blogs');
    await clearCacheByPrefix('trending');

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

    // Remove data that pointed at the deleted blog
    await Comment.deleteMany({ blog: blog._id });
    await User.updateMany(
        { bookmarks: blog._id },
        { $pull: { bookmarks: blog._id } }
    );

    await clearCacheByPrefix('blogs');
    await clearCacheByPrefix('trending');

    res.status(200).json({
        message: "Blog deleted successfully"
    });

});

export const toggleLike = asyncHandler(async (req, res) => {

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        res.status(404);
        throw new Error("Blog not found");
    }

    const userId = req.user._id;

    const alreadyLiked = blog.likes.includes(userId);

    if (alreadyLiked) {

        blog.likes = blog.likes.filter(
            id => id.toString() !== userId.toString()
        );

        await blog.save();

        return res.status(200).json({
            message: "Blog unliked"
        });

    } else {

        blog.likes.push(userId);
        await blog.save();

        return res.status(200).json({
            message: "Blog liked"
        });

    }

});



export const getTrendingBlogs = asyncHandler(async (req, res) => {

    const blogs = await Blog.find({ isPublished: true })
        .sort({ views: -1 })
        .limit(5)
        .populate("author", "name email");

    res.status(200).json({
        blogs
    });

});

export const toggleBookmark = asyncHandler(async (req, res) => {

    const user = req.user;

    const blogId = req.params.id;

    if (!(await Blog.exists({ _id: blogId }))) {
        res.status(404);
        throw new Error("Blog not found");
    }

    const alreadyBookmarked = user.bookmarks.includes(blogId);

    if (alreadyBookmarked) {

        user.bookmarks = user.bookmarks.filter(
            id => id.toString() !== blogId
        );

        await user.save();

        return res.json({
            message: "Bookmark removed"
        });

    } else {

        user.bookmarks.push(blogId);

        await user.save();

        return res.json({
            message: "Blog bookmarked"
        });

    }

});



export const getBookmarks = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id)
        .populate({
            path: "bookmarks",
            populate: { path: "author", select: "name email" }
        });

    res.json({
        bookmarks: user.bookmarks
    });

});


