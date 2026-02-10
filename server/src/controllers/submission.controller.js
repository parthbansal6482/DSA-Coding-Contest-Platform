const Submission = require('../models/Submission');
const Question = require('../models/Question');
const Round = require('../models/Round');
const Team = require('../models/Team');
const { runTestCases } = require('../services/execution.service');
const { broadcastLeaderboardUpdate, broadcastTeamStatsUpdate, broadcastSubmissionUpdate } = require('../socket');

/**
 * Submit code for a question
 * POST /api/submissions
 */
exports.submitCode = async (req, res) => {
    try {
        const { questionId, roundId, code, language } = req.body;
        const teamId = req.team._id;

        // Validate inputs
        if (!questionId || !roundId || !code || !language) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
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
            return res.status(400).json({
                success: false,
                message: 'Round is not active',
            });
        }


        // Check if question exists and belongs to round
        const question = await Question.findById(questionId).select('+hiddenTestCases');
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found',
            });
        }

        if (!round.questions.includes(questionId)) {
            return res.status(400).json({
                success: false,
                message: 'Question does not belong to this round',
            });
        }

        // Create submission with pending status
        const submission = await Submission.create({
            team: teamId,
            round: roundId,
            question: questionId,
            code,
            language,
            status: 'pending',
            totalTestCases: (question.examples?.length || 0) + (question.hiddenTestCases?.length || 0),
        });

        // Run code asynchronously
        runCodeAsync(submission._id, code, language, question, round);

        res.status(201).json({
            success: true,
            message: 'Submission received and being evaluated',
            data: {
                submissionId: submission._id,
                status: 'pending',
            },
        });
    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing submission',
            error: error.message,
        });
    }
};

/**
 * Run code asynchronously and update submission
 */
async function runCodeAsync(submissionId, code, language, question, round) {
    try {
        // Prepare test cases - combine examples and hidden test cases
        const visibleTestCases = question.examples.map(example => ({
            input: example.input,
            expectedOutput: example.output,
        }));

        const hiddenTestCases = (question.hiddenTestCases || []).map(testCase => ({
            input: testCase.input,
            expectedOutput: testCase.output,
        }));

        // Combine all test cases for evaluation
        const testCases = [...visibleTestCases, ...hiddenTestCases];

        // Run test cases
        const result = await runTestCases(code, language, testCases);

        // Determine status
        let status = 'accepted';
        if (result.passedTests === 0) {
            status = 'wrong_answer';
        } else if (result.passedTests < result.totalTests) {
            status = 'wrong_answer';
        }

        // Check for errors
        const hasErrors = result.results.some(r => r.error && r.error.includes('timeout'));
        if (hasErrors) {
            status = 'time_limit_exceeded';
        }

        const hasRuntimeErrors = result.results.some(r => r.error && !r.error.includes('timeout'));
        if (hasRuntimeErrors && status !== 'time_limit_exceeded') {
            status = 'runtime_error';
        }

        // Calculate points (proportional to passed tests)
        const points = status === 'accepted'
            ? question.points || 100
            : Math.floor((result.passedTests / result.totalTests) * (question.points || 100));

        // Get average execution time and max memory
        const avgExecutionTime = result.results.reduce((sum, r) => sum + r.executionTime, 0) / result.results.length;
        const maxMemory = Math.max(...result.results.map(r => r.memoryUsed));

        // Update submission
        const updatedSubmission = await Submission.findByIdAndUpdate(
            submissionId,
            {
                status,
                testCasesPassed: result.passedTests,
                points,
                executionTime: Math.round(avgExecutionTime),
                memoryUsed: maxMemory,
                testResults: result.results,
            },
            { new: true }
        );

        // Get team ID for broadcasting
        const submission = await Submission.findById(submissionId);
        const teamId = submission.team;

        // If accepted, update team points and score
        if (status === 'accepted') {
            // Check if this is the first accepted submission for this question
            const previousAccepted = await Submission.findOne({
                team: teamId,
                question: submission.question,
                status: 'accepted',
                _id: { $ne: submissionId },
            });

            if (!previousAccepted) {
                // Refetch round to get most up-to-date startTime and duration
                const freshRound = await Round.findById(round._id);
                const startTime = freshRound?.startTime ? new Date(freshRound.startTime).getTime() : (round.startTime ? new Date(round.startTime).getTime() : Date.now());
                const now = Date.now();
                const totalDurationMs = (freshRound?.duration || round.duration || 60) * 60 * 1000;
                const elapsedMs = Math.max(0, now - startTime);

                console.log(`Debug Scoring: now=${now}, startTime=${startTime}, duration=${freshRound?.duration || round.duration}, totalDurationMs=${totalDurationMs}, elapsedMs=${elapsedMs}`);

                let timeRemainingRatio = 1 - (elapsedMs / totalDurationMs);
                timeRemainingRatio = Math.max(0.2, Math.min(1, timeRemainingRatio));

                if (isNaN(timeRemainingRatio)) timeRemainingRatio = 0.5;

                const basePoints = question.points || 100;
                const currencyPoints = Math.floor(basePoints * timeRemainingRatio);

                // Score = Also time-based for leaderboard
                const scoreReward = Math.floor(basePoints * timeRemainingRatio);

                console.log(`Scoring: timeRatio=${timeRemainingRatio.toFixed(2)}, points=${currencyPoints}, score=${scoreReward}`);

                await Team.findByIdAndUpdate(teamId, {
                    $inc: {
                        points: currencyPoints || 0,
                        score: scoreReward || 0
                    },
                });

                console.log(`Team awarded ${scoreReward} score and ${currencyPoints} currency points for solving ${question.title}`);

                // Broadcast leaderboard update
                broadcastLeaderboardUpdate();

                // Broadcast team stats update
                broadcastTeamStatsUpdate(teamId);
            }
        }

        // Broadcast submission update to the team
        broadcastSubmissionUpdate(teamId, {
            question: submission.question,
            status,
            points,
            submittedAt: submission.submittedAt,
        });

    } catch (error) {
        console.error('Code execution error:', error);

        // Update submission with error
        await Submission.findByIdAndUpdate(submissionId, {
            status: 'runtime_error',
            error: error.message,
        });
    }
}

/**
 * Get submission by ID
 * GET /api/submissions/:id
 */
exports.getSubmission = async (req, res) => {
    try {
        const { id } = req.params;

        const submission = await Submission.findById(id)
            .populate('question', 'title difficulty')
            .populate('round', 'name')
            .populate('team', 'teamName');

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found',
            });
        }

        // Check if user has access to this submission
        if (req.team && submission.team._id.toString() !== req.team._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
            });
        }

        res.status(200).json({
            success: true,
            data: submission,
        });
    } catch (error) {
        console.error('Get submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching submission',
            error: error.message,
        });
    }
};

/**
 * Get team submissions
 * GET /api/submissions/team/:teamId
 */
exports.getTeamSubmissions = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { roundId, questionId } = req.query;

        // Check access
        if (req.team && req.team._id.toString() !== teamId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
            });
        }

        const filter = { team: teamId };
        if (roundId) filter.round = roundId;
        if (questionId) filter.question = questionId;

        const submissions = await Submission.find(filter)
            .populate('question', 'title difficulty points')
            .populate('round', 'name')
            .sort({ submittedAt: -1 });

        res.status(200).json({
            success: true,
            data: submissions,
        });
    } catch (error) {
        console.error('Get team submissions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching submissions',
            error: error.message,
        });
    }
};

/**
 * Get leaderboard for a round
 * GET /api/submissions/leaderboard/:roundId
 */
exports.getLeaderboard = async (req, res) => {
    try {
        const { roundId } = req.params;

        // Get all accepted submissions for this round
        const submissions = await Submission.find({
            round: roundId,
            status: 'accepted',
        })
            .populate('team', 'teamName')
            .populate('question', 'title points');

        // Calculate team scores
        const teamScores = {};
        submissions.forEach(sub => {
            const teamId = sub.team._id.toString();
            if (!teamScores[teamId]) {
                teamScores[teamId] = {
                    teamName: sub.team.teamName,
                    totalPoints: 0,
                    solvedProblems: 0,
                    submissions: [],
                };
            }

            // Only count first accepted submission for each question
            const alreadySolved = teamScores[teamId].submissions.some(
                s => s.question.toString() === sub.question._id.toString()
            );

            if (!alreadySolved) {
                teamScores[teamId].totalPoints += sub.points;
                teamScores[teamId].solvedProblems += 1;
                teamScores[teamId].submissions.push({
                    question: sub.question._id,
                    points: sub.points,
                });
            }
        });

        // Convert to array and sort by totalScore
        const leaderboard = Object.values(teamScores)
            .sort((a, b) => {
                if (b.totalPoints !== a.totalPoints) {
                    return b.totalPoints - a.totalPoints;
                }
                return b.solvedProblems - a.solvedProblems;
            })
            .map((team, index) => ({
                rank: index + 1,
                ...team,
            }));

        res.status(200).json({
            success: true,
            data: leaderboard,
        });
    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching leaderboard',
            error: error.message,
        });
    }
};

module.exports = exports;
