const express = require('express');
const router = express.Router();
const {
    createRound,
    getAllRounds,
    getRoundById,
    updateRound,
    deleteRound,
    updateRoundStatus,
    getActiveRounds,
    getRoundQuestions,
    submitSolution,
    getRoundSubmissions,
} = require('../controllers/round.controller');
const { protect, adminOnly, teamOnly } = require('../middleware/auth');
const { validateRound } = require('../middleware/validation');

// Team routes - must come before admin routes to avoid conflicts
// @route   GET /api/rounds/active
// @desc    Get active rounds for teams
// @access  Private/Team
router.get('/active', protect, teamOnly, getActiveRounds);

// @route   GET /api/rounds/:id/questions
// @desc    Get questions for a specific round
// @access  Private/Team
router.get('/:id/questions', protect, teamOnly, getRoundQuestions);

// @route   POST /api/rounds/:id/submit
// @desc    Submit solution for a question
// @access  Private/Team
router.post('/:id/submit', protect, teamOnly, submitSolution);

// @route   GET /api/rounds/:id/submissions
// @desc    Get team's submissions for a round
// @access  Private/Team
router.get('/:id/submissions', protect, teamOnly, getRoundSubmissions);

// Admin routes - all routes below require admin authentication
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

