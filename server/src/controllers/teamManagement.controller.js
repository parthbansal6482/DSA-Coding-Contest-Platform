const Team = require('../models/Team');

// @desc    Get all teams (with optional status filter)
// @route   GET /api/teams?status=pending
// @access  Private (Admin)
exports.getAllTeams = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};

        const teams = await Team.find(filter)
            .select('-password')
            .sort({ registrationDate: -1 });

        res.status(200).json({
            success: true,
            count: teams.length,
            teams,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

// @desc    Approve team
// @route   PUT /api/teams/:teamId/approve
// @access  Private (Admin)
exports.approveTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.teamId);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found',
            });
        }

        if (team.status === 'approved') {
            return res.status(400).json({
                success: false,
                message: 'Team is already approved',
            });
        }

        team.status = 'approved';
        team.approvedBy = req.admin._id;
        team.approvedAt = Date.now();
        await team.save();

        res.status(200).json({
            success: true,
            message: 'Team approved successfully',
            team: {
                id: team._id,
                teamName: team.teamName,
                members: team.members,
                status: team.status,
                approvedAt: team.approvedAt,
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

// @desc    Reject team
// @route   PUT /api/teams/:teamId/reject
// @access  Private (Admin)
exports.rejectTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.teamId);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found',
            });
        }

        if (team.status === 'rejected') {
            return res.status(400).json({
                success: false,
                message: 'Team is already rejected',
            });
        }

        team.status = 'rejected';
        await team.save();

        res.status(200).json({
            success: true,
            message: 'Team rejected',
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
