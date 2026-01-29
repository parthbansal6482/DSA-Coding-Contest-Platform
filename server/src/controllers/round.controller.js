const Round = require('../models/Round');
const Question = require('../models/Question');

/**
 * @desc    Create a new round
 * @route   POST /api/rounds
 * @access  Private/Admin
 */
const createRound = async (req, res) => {
    try {
        // Verify all questions exist
        if (req.body.questions && req.body.questions.length > 0) {
            const questions = await Question.find({ _id: { $in: req.body.questions } });
            if (questions.length !== req.body.questions.length) {
                return res.status(400).json({
                    success: false,
                    message: 'One or more questions not found',
                });
            }
        }

        const roundData = {
            ...req.body,
            createdBy: req.admin._id,
        };

        const round = await Round.create(roundData);
        const populatedRound = await Round.findById(round._id).populate('questions', 'title difficulty category');

        res.status(201).json({
            success: true,
            data: populatedRound,
        });
    } catch (error) {
        // Handle duplicate name error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A round with this name already exists',
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: messages,
            });
        }

        console.error('Error creating round:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating round',
            error: error.message,
        });
    }
};

/**
 * @desc    Get all rounds
 * @route   GET /api/rounds
 * @access  Private/Admin
 */
const getAllRounds = async (req, res) => {
    try {
        const { status, search } = req.query;

        // Build filter object
        const filter = {};
        if (status) filter.status = status;
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        const rounds = await Round.find(filter)
            .populate('questions', 'title difficulty category')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: rounds.length,
            data: rounds,
        });
    } catch (error) {
        console.error('Error fetching rounds:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching rounds',
            error: error.message,
        });
    }
};

/**
 * @desc    Get single round by ID
 * @route   GET /api/rounds/:id
 * @access  Private/Admin
 */
const getRoundById = async (req, res) => {
    try {
        const round = await Round.findById(req.params.id)
            .populate('questions')
            .populate('createdBy', 'name email');

        if (!round) {
            return res.status(404).json({
                success: false,
                message: 'Round not found',
            });
        }

        res.status(200).json({
            success: true,
            data: round,
        });
    } catch (error) {
        console.error('Error fetching round:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching round',
            error: error.message,
        });
    }
};

/**
 * @desc    Update round
 * @route   PUT /api/rounds/:id
 * @access  Private/Admin
 */
const updateRound = async (req, res) => {
    try {
        // Verify all questions exist if questions are being updated
        if (req.body.questions && req.body.questions.length > 0) {
            const questions = await Question.find({ _id: { $in: req.body.questions } });
            if (questions.length !== req.body.questions.length) {
                return res.status(400).json({
                    success: false,
                    message: 'One or more questions not found',
                });
            }
        }

        const round = await Round.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        ).populate('questions', 'title difficulty category');

        if (!round) {
            return res.status(404).json({
                success: false,
                message: 'Round not found',
            });
        }

        res.status(200).json({
            success: true,
            data: round,
        });
    } catch (error) {
        // Handle duplicate name error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A round with this name already exists',
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: messages,
            });
        }

        console.error('Error updating round:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating round',
            error: error.message,
        });
    }
};

/**
 * @desc    Delete round
 * @route   DELETE /api/rounds/:id
 * @access  Private/Admin
 */
const deleteRound = async (req, res) => {
    try {
        const round = await Round.findByIdAndDelete(req.params.id);

        if (!round) {
            return res.status(404).json({
                success: false,
                message: 'Round not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Round deleted successfully',
            data: {},
        });
    } catch (error) {
        console.error('Error deleting round:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting round',
            error: error.message,
        });
    }
};

/**
 * @desc    Update round status
 * @route   PATCH /api/rounds/:id/status
 * @access  Private/Admin
 */
const updateRoundStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['upcoming', 'active', 'completed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be upcoming, active, or completed',
            });
        }

        const updateData = { status };

        // Set start time when status changes to active
        if (status === 'active') {
            updateData.startTime = new Date();
        }

        // Set end time when status changes to completed
        if (status === 'completed') {
            updateData.endTime = new Date();
        }

        const round = await Round.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).populate('questions', 'title difficulty category');

        if (!round) {
            return res.status(404).json({
                success: false,
                message: 'Round not found',
            });
        }

        res.status(200).json({
            success: true,
            data: round,
        });
    } catch (error) {
        console.error('Error updating round status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating round status',
            error: error.message,
        });
    }
};

module.exports = {
    createRound,
    getAllRounds,
    getRoundById,
    updateRound,
    deleteRound,
    updateRoundStatus,
};
