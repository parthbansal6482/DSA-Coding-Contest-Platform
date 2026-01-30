const Round = require('../models/Round');
const Question = require('../models/Question');
const Submission = require('../models/Submission');
const Team = require('../models/Team');

// ... existing admin functions ...

/**
 * @desc    Get active rounds for teams
 * @route   GET /api/rounds/active
 * @access  Private/Team
 */
const getActiveRounds = async (req, res) => {
    try {
        const rounds = await Round.find({ status: { $in: ['active', 'upcoming'] } })
            .select('name duration status startTime endTime')
            .sort({ startTime: 1 });

        // Calculate time remaining for active rounds
        const roundsWithTime = rounds.map(round => {
            const roundObj = round.toObject();
            if (round.status === 'active' && round.endTime) {
                const now = new Date();
                const timeRemaining = Math.max(0, Math.floor((round.endTime - now) / 1000));
                roundObj.timeRemaining = timeRemaining;
            }
            return roundObj;
        });

        res.status(200).json({
            success: true,
            count: roundsWithTime.length,
            data: roundsWithTime,
        });
    } catch (error) {
        console.error('Error fetching active rounds:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching active rounds',
            error: error.message,
        });
    }
};

/**
 * @desc    Get round questions for teams
 * @route   GET /api/rounds/:id/questions
 * @access  Private/Team
 */
const getRoundQuestions = async (req, res) => {
    try {
        console.log('getRoundQuestions called with roundId:', req.params.id);
        console.log('Team ID:', req.team?._id);

        const round = await Round.findById(req.params.id)
            .populate('questions', '-createdBy -createdAt -updatedAt')
            .select('name duration status startTime endTime questions');

        console.log('Round found:', round ? 'Yes' : 'No');
        if (round) {
            console.log('Round status:', round.status);
            console.log('Questions count:', round.questions?.length);
        }

        if (!round) {
            return res.status(404).json({
                success: false,
                message: 'Round not found',
            });
        }

        // Only allow access to active rounds
        if (round.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: 'This round is not currently active',
            });
        }

        // Get team's submissions for this round
        const submissions = await Submission.find({
            team: req.team._id,
            round: req.params.id,
        }).select('question status points testCasesPassed totalTestCases');

        console.log('Submissions found:', submissions.length);

        // Map submissions to questions
        const submissionMap = {};
        submissions.forEach(sub => {
            const questionId = sub.question.toString();
            if (!submissionMap[questionId] || sub.status === 'accepted') {
                submissionMap[questionId] = {
                    status: sub.status,
                    points: sub.points,
                    testCasesPassed: sub.testCasesPassed,
                    totalTestCases: sub.totalTestCases,
                };
            }
        });

        // Add submission status to questions
        const questionsWithStatus = round.questions.map(q => {
            const questionObj = q.toObject();
            const submission = submissionMap[q._id.toString()];
            questionObj.submissionStatus = submission ? submission.status : 'unsolved';
            questionObj.earnedPoints = submission ? submission.points : 0;
            return questionObj;
        });

        res.status(200).json({
            success: true,
            data: {
                round: {
                    _id: round._id,
                    name: round.name,
                    duration: round.duration,
                    status: round.status,
                    startTime: round.startTime,
                    endTime: round.endTime,
                },
                questions: questionsWithStatus,
            },
        });
    } catch (error) {
        console.error('Error fetching round questions:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Error fetching round questions',
            error: error.message,
        });
    }
};

/**
 * @desc    Submit solution for a question
 * @route   POST /api/rounds/:id/submit
 * @access  Private/Team
 */
const submitSolution = async (req, res) => {
    try {
        const { questionId, code, language } = req.body;
        const roundId = req.params.id;
        const teamId = req.team._id;

        // Validate input
        if (!questionId || !code || !language) {
            return res.status(400).json({
                success: false,
                message: 'Question ID, code, and language are required',
            });
        }

        // Check if round is active
        const round = await Round.findById(roundId);
        if (!round) {
            return res.status(404).json({
                success: false,
                message: 'Round not found',
            });
        }

        if (round.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: 'This round is not currently active',
            });
        }

        // Check if question exists and belongs to this round
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found',
            });
        }

        if (!round.questions.includes(questionId)) {
            return res.status(400).json({
                success: false,
                message: 'This question does not belong to this round',
            });
        }

        // For now, simulate test case execution
        // In production, this would call a code execution service
        const totalTestCases = question.testCases;
        const testCasesPassed = Math.floor(Math.random() * (totalTestCases + 1)); // Simulate
        const status = testCasesPassed === totalTestCases ? 'accepted' : 'wrong_answer';

        // Calculate points based on difficulty and test cases passed
        const basePoints = {
            'Easy': 100,
            'Medium': 150,
            'Hard': 200,
        };
        const points = status === 'accepted' ? basePoints[question.difficulty] : 0;

        // Create submission
        const submission = await Submission.create({
            team: teamId,
            round: roundId,
            question: questionId,
            code,
            language,
            status,
            testCasesPassed,
            totalTestCases,
            points,
        });

        // If accepted, update team points
        if (status === 'accepted') {
            // Check if this is the first accepted submission for this question in this round
            const previousAccepted = await Submission.findOne({
                team: teamId,
                round: roundId,
                question: questionId,
                status: 'accepted',
                _id: { $ne: submission._id },
            });

            if (!previousAccepted) {
                await Team.findByIdAndUpdate(teamId, {
                    $inc: { points: points },
                });
            }
        }

        res.status(201).json({
            success: true,
            message: status === 'accepted' ? 'Solution accepted!' : 'Solution incorrect',
            data: {
                submissionId: submission._id,
                status,
                testCasesPassed,
                totalTestCases,
                points,
            },
        });
    } catch (error) {
        console.error('Error submitting solution:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting solution',
            error: error.message,
        });
    }
};

/**
 * @desc    Get team's submissions for a round
 * @route   GET /api/rounds/:id/submissions
 * @access  Private/Team
 */
const getRoundSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({
            team: req.team._id,
            round: req.params.id,
        })
            .populate('question', 'title difficulty')
            .sort({ submittedAt: -1 });

        res.status(200).json({
            success: true,
            count: submissions.length,
            data: submissions,
        });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching submissions',
            error: error.message,
        });
    }
};


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

        // Get the existing round to check current values
        const existingRound = await Round.findById(req.params.id);
        if (!existingRound) {
            return res.status(404).json({
                success: false,
                message: 'Round not found',
            });
        }

        // Calculate endTime if status is changing to 'active' or if startTime/duration are being updated
        const updateData = { ...req.body };

        // If status is changing to 'active', set startTime to now if not provided
        if (updateData.status === 'active' && !updateData.startTime) {
            updateData.startTime = new Date();
        }

        // Calculate endTime if we have both startTime and duration
        const startTime = updateData.startTime || existingRound.startTime;
        const duration = updateData.duration !== undefined ? updateData.duration : existingRound.duration;

        if (startTime && duration) {
            const durationMs = duration * 60 * 1000; // duration is in minutes
            updateData.endTime = new Date(new Date(startTime).getTime() + durationMs);
        }

        const round = await Round.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        ).populate('questions', 'title difficulty category');

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
    getActiveRounds,
    getRoundQuestions,
    submitSolution,
    getRoundSubmissions,
};

