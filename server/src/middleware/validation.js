const { body, validationResult } = require('express-validator');

// Validation middleware
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((err) => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }
    next();
};

// Admin signup validation rules
exports.adminSignupRules = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
];

// Admin login validation rules
exports.adminLoginRules = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
];

// Team registration validation rules
exports.teamRegisterRules = [
    body('teamName').trim().notEmpty().withMessage('Team name is required'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('members')
        .isArray({ min: 2, max: 3 })
        .withMessage('Team must have 2 to 3 members'),
    body('members.*.name').trim().notEmpty().withMessage('Member name is required'),
    body('members.*.email')
        .isEmail()
        .withMessage('Please provide valid email for all members'),
];

// Team login validation rules
exports.teamLoginRules = [
    body('teamName').trim().notEmpty().withMessage('Team name is required'),
    body('password').notEmpty().withMessage('Password is required'),
];
