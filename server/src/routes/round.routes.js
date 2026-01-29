const express = require('express');
const router = express.Router();
const {
    createRound,
    getAllRounds,
    getRoundById,
    updateRound,
    deleteRound,
    updateRoundStatus,
} = require('../controllers/round.controller');
const { protect, adminOnly } = require('../middleware/auth');
const { validateRound } = require('../middleware/validation');

// All routes require admin authentication
router.use(protect);
router.use(adminOnly);

// @route   POST /api/rounds
// @desc    Create new round
// @access  Private/Admin
router.post('/', validateRound, createRound);

// @route   GET /api/rounds
// @desc    Get all rounds
// @access  Private/Admin
router.get('/', getAllRounds);

// @route   GET /api/rounds/:id
// @desc    Get round by ID
// @access  Private/Admin
router.get('/:id', getRoundById);

// @route   PUT /api/rounds/:id
// @desc    Update round
// @access  Private/Admin
router.put('/:id', validateRound, updateRound);

// @route   DELETE /api/rounds/:id
// @desc    Delete round
// @access  Private/Admin
router.delete('/:id', deleteRound);

// @route   PATCH /api/rounds/:id/status
// @desc    Update round status
// @access  Private/Admin
router.patch('/:id/status', updateRoundStatus);

module.exports = router;
