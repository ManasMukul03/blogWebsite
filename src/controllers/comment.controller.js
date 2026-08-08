import Comment from "../models/comment.model.js";
import Blog from "../models/blog.model.js";
import asyncHandler from "../utils/asyncHandler.js";


// Create Comment
export const createComment = asyncHandler(async (req, res) => {

    const { text } = req.body;
    const blogId = req.params.blogId;

    if (!text) {
        res.status(400);
        throw new Error("Comment text is required");
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
        res.status(404);
        throw new Error("Blog not found");
    }

    const comment = await Comment.create({
        text,
        blog: blogId,
        user: req.user._id
    });

    res.status(201).json({
        message: "Comment added",
        comment
    });

});


// Get Comments for a Blog
export const getComments = asyncHandler(async (req, res) => {

    const comments = await Comment.find({
        blog: req.params.blogId
    })
        .populate("user", "name email")
        .sort({ createdAt: -1 });

    res.status(200).json({
        count: comments.length,
        comments
    });

});


// Delete Comment
export const deleteComment = asyncHandler(async (req, res) => {

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
        res.status(404);
        throw new Error("Comment not found");
    }

    if (comment.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to delete this comment");
    }

    await comment.deleteOne();

    res.status(200).json({
        message: "Comment deleted"
    });

});