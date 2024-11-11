import { body } from 'express-validator';

export const createLessonValidator = [
    body('date')
        .isString()
        .withMessage('Date must be a string.')
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage('Date must be in the format YYYY-MM-DD.'),

    body('title').isString().withMessage('Title must be a string.').notEmpty().withMessage('Title cannot be empty.'),

    body('status').isInt({ min: 0, max: 1 }).withMessage('Status must be 0 or 1.').toInt()
];
