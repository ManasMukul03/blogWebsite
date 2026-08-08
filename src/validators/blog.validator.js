import { body } from 'express-validator';

export const createBlogValidator = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 150 }).withMessage('Title must be 3-150 characters'),

    body('content')
        .trim()
        .notEmpty().withMessage('Content is required')
        .isLength({ min: 20 }).withMessage('Content must be at least 20 characters'),

    body('tags')
        .optional()
        .isArray().withMessage('Tags must be an array'),

    body('coverImage')
        .optional()
        .isURL().withMessage('Cover image must be a valid URL')
];

export const updateBlogValidator = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 150 }).withMessage('Title must be 3-150 characters'),

    body('content')
        .optional()
        .trim()
        .isLength({ min: 20 }).withMessage('Content must be at least 20 characters'),

    body('tags')
        .optional()
        .isArray().withMessage('Tags must be an array'),

    body('isPublished')
        .optional()
        .isBoolean().withMessage('isPublished must be true or false')
];
