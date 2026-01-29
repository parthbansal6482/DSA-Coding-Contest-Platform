const express = require('express');
const router = express.Router();
const { getOverviewStats } = require('../controllers/stats.controller');
const { protect, adminOnly } = require('../middleware/auth');

// All routes require admin authentication
router.use(protect);
router.use(adminOnly);

// @route   GET /api/stats/overview
// @desc    Get overview statistics
// @access  Private/Admin
router.get('/overview', getOverviewStats);

module.exports = router;
