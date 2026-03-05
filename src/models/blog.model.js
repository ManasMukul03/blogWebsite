import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        content: {
            type: String,
            required: true
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        tags: [
            {
                type: String
            }
        ],

        coverImage: {
            type: String
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],

        isPublished: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;