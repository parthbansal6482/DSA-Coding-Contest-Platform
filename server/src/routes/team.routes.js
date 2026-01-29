const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getProfile,
} = require('../controllers/team.controller');
const { protect, teamOnly } = require('../middleware/auth');
const {
    teamRegisterRules,
    teamLoginRules,
    validate,
} = require('../middleware/validation');

// Public routes
router.post('/register', teamRegisterRules, validate, register);
router.post('/login', teamLoginRules, validate, login);

// Protected routes
router.get('/profile', protect, teamOnly, getProfile);

module.exports = router;
