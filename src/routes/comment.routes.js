import express from "express";
import {
    createComment,
    getComments,
    deleteComment
} from "../controllers/comment.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// Create comment
router.post("/:blogId", protect, createComment);

// Get comments for a blog
router.get("/:blogId", getComments);

// Delete comment
router.delete("/:id", protect, deleteComment);

export default router;