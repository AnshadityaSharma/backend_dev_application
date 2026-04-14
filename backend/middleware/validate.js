const { body, validationResult } = require('express-validator');

/**
 * Middleware that checks the result of express-validator chains.
 * If any validation errors exist, returns a 400 with details.
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
        });
    }
    next();
};

// Validation chains for user registration
const registerRules = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters')
        .isAlphanumeric().withMessage('Username must only contain letters and numbers'),
    body('email')
        .trim()
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role')
        .optional()
        .isIn(['user', 'admin']).withMessage('Role must be either user or admin'),
];

// Validation chains for login
const loginRules = [
    body('email')
        .trim()
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required'),
];

// Validation chains for creating a task
const createTaskRules = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
];

// Validation chains for updating a task
const updateTaskRules = [
    body('title')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    body('status')
        .optional()
        .isIn(['pending', 'in-progress', 'completed']).withMessage('Status must be pending, in-progress, or completed'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
];

module.exports = {
    handleValidationErrors,
    registerRules,
    loginRules,
    createTaskRules,
    updateTaskRules,
};
