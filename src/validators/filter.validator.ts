import { query } from 'express-validator';

export const filterValidator = [
    query('date')
        .optional()
        .isString()
        .matches(/^(\d{4}-\d{2}-\d{2})(,\d{4}-\d{2}-\d{2})?$/)
        .withMessage('Invalid date format. Expected format: YYYY-MM-DD or YYYY-MM-DD,YYYY-MM-DD'),

    query('status').optional().isInt({ min: 0, max: 1 }).withMessage('Status must be 0 or 1'),

    query('teacherIds')
        .optional()
        .isString()
        .custom((value) => {
            const teacherIds = value.split(',').map(Number);
            return teacherIds.every((id) => !isNaN(id) && id > 0);
        })
        .withMessage('Teacher IDs must be a comma-separated list of positive integers'),

    query('studentsCount')
        .optional()
        .isString()
        .custom((value) => {
            const parts = value.split(',');
            if (parts.length > 2) return false;
            return parts.every((part) => !isNaN(Number(part)));
        })
        .withMessage('Students count must be a single number or a range like "10,20"'),

    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),

    query('lessonsPerPage').optional().isInt({ min: 1 }).withMessage('Lessons per page must be a positive integer')
];
