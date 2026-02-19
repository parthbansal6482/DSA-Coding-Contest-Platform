const express = require('express');
const router = express.Router();
const {
    signup,
    login,
    getProfile,
} = require('../../controllers/extended/admin.controller');
const { protect, adminOnly } = require('../../middleware/extended/auth');
const {
    adminSignupRules,
    adminLoginRules,
    validate,
} = require('../../middleware/common/validation');

// Public routes
router.post('/signup', adminSignupRules, validate, signup);
router.post('/login', adminLoginRules, validate, login);

// Protected routes
router.get('/profile', protect, adminOnly, getProfile);

module.exports = router;
