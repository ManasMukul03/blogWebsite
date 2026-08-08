import { body } from 'express-validator';

export const createCommentValidator = [
    body('text')
        .trim()
        .notEmpty().withMessage('Comment text is required')
        .isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
];
