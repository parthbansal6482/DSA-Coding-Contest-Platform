const Team = require('../models/Team');
const { generateToken } = require('../utils/jwt');

// @desc    Register team
// @route   POST /api/team/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { teamName, password, members } = req.body;

        // Check if team already exists
        const teamExists = await Team.findOne({ teamName });
        if (teamExists) {
            return res.status(400).json({
                success: false,
                message: 'Team with this name already exists',
            });
        }

        // Validate member count
        if (!members || members.length < 2 || members.length > 3) {
            return res.status(400).json({
                success: false,
                message: 'Team must have 2 to 3 members',
            });
        }

        // Create team
        const team = await Team.create({
            teamName,
            password,
            members,
        });

        res.status(201).json({
            success: true,
            message: 'Team registered successfully. Waiting for admin approval.',
            team: {
                id: team._id,
                teamName: team.teamName,
                members: team.members,
                status: team.status,
                registrationDate: team.registrationDate,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

// @desc    Login team
// @route   POST /api/team/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { teamName, password } = req.body;

        // Check for team
        const team = await Team.findOne({ teamName }).select('+password');
        if (!team) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check if team is approved
        if (team.status !== 'approved') {
            return res.status(403).json({
                success: false,
                message: `Your team registration is ${team.status}. Please wait for admin approval.`,
                status: team.status,
            });
        }

        // Check password
        const isMatch = await team.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Generate token
        const token = generateToken(team._id, 'team');

        res.status(200).json({
            success: true,
            token,
            team: {
                id: team._id,
                teamName: team.teamName,
                members: team.members,
                status: team.status,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

// @desc    Get team profile
// @route   GET /api/team/profile
// @access  Private (Team)
exports.getProfile = async (req, res) => {
    try {
        const team = req.team;

        res.status(200).json({
            success: true,
            team: {
                id: team._id,
                teamName: team.teamName,
                members: team.members,
                status: team.status,
                registrationDate: team.registrationDate,
                createdAt: team.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

// @desc    Get team stats (points, rank, tokens, active rounds)
// @route   GET /api/team/stats
// @access  Private (Team)
exports.getTeamStats = async (req, res) => {
    try {
        const team = req.team;
        const Round = require('../models/Round');

        // Get all approved teams sorted by points to calculate rank
        const allTeams = await Team.find({ status: 'approved' })
            .sort({ points: -1 })
            .select('_id points');

        // Find current team's rank
        const rank = allTeams.findIndex(t => t._id.toString() === team._id.toString()) + 1;

        // Get active rounds count
        const activeRoundsCount = await Round.countDocuments({ status: 'active' });

        res.status(200).json({
            success: true,
            data: {
                teamName: team.teamName,
                members: team.members,
                points: team.points || 0,
                rank: rank || 0,
                tokens: {
                    sabotage: team.sabotageTokens || 0,
                    shield: team.shieldTokens || 0,
                },
                activeRoundsCount,
            },
        });
    } catch (error) {
        console.error('Error fetching team stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching team statistics',
            error: error.message,
        });
    }
};

// @desc    Get team recent activity
// @route   GET /api/team/activity
// @access  Private (Team)
exports.getTeamActivity = async (req, res) => {
    try {
        const team = req.team;
        const limit = parseInt(req.query.limit) || 10;

        // For now, return mock activity since we don't have submissions model yet
        // TODO: Replace with real submission data when submission system is implemented
        const activities = [
            {
                type: 'submission',
                action: 'Completed "Two Sum"',
                points: '+100 points',
                timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
                status: 'success',
            },
            {
                type: 'submission',
                action: 'Attempted "Binary Tree"',
                points: 'No points',
                timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
                status: 'neutral',
            },
            {
                type: 'purchase',
                action: 'Purchased Shield Token',
                points: '-200 points',
                timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
                status: 'purchase',
            },
        ];

        res.status(200).json({
            success: true,
            count: activities.length,
            data: activities,
        });
    } catch (error) {
        console.error('Error fetching team activity:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching team activity',
            error: error.message,
        });
    }
};

// @desc    Get leaderboard (all teams ranked by points)
// @route   GET /api/team/leaderboard
// @access  Private (Team)
exports.getLeaderboard = async (req, res) => {
    try {
        // Get all approved teams sorted by points (descending)
        const teams = await Team.find({ status: 'approved' })
            .sort({ points: -1 })
            .select('teamName points members sabotageTokens shieldTokens');

        // Format leaderboard data with ranks
        const leaderboard = teams.map((team, index) => ({
            rank: index + 1,
            teamName: team.teamName,
            points: team.points || 0,
            memberCount: team.members.length,
            tokens: {
                sabotage: team.sabotageTokens || 0,
                shield: team.shieldTokens || 0,
            },
        }));

        res.status(200).json({
            success: true,
            count: leaderboard.length,
            data: leaderboard,
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching leaderboard',
            error: error.message,
        });
    }
};
