import { body, param } from 'express-validator';

export const updateLessonValidator = [
    param('id').isInt().withMessage('ID must be a valid integer.').toInt(), // Преобразуем id в целое число
    body('date')
        .optional()
        .isString()
        .withMessage('Date must be a string.')
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage('Date must be in the format YYYY-MM-DD.'),

    body('title')
        .optional()
        .isString()
        .withMessage('Title must be a string.')
        .notEmpty()
        .withMessage('Title cannot be empty.'),

    body('status').optional().isInt({ min: 0, max: 1 }).withMessage('Status must be 0 or 1.').toInt() // Преобразуем в целое число (если это не сделано в контроллере)
];
