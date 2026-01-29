const Team = require('../models/Team');

/**
 * @desc    Get overview statistics for admin dashboard
 * @route   GET /api/stats/overview
 * @access  Private/Admin
 */
const getOverviewStats = async (req, res) => {
    try {
        // Get total teams count
        const totalTeams = await Team.countDocuments();

        // Get pending approvals count
        const pendingApprovals = await Team.countDocuments({ status: 'pending' });

        // Get approved teams count
        const approvedTeams = await Team.countDocuments({ status: 'approved' });

        // Get rejected teams count
        const rejectedTeams = await Team.countDocuments({ status: 'rejected' });

        // TODO: Add questions and rounds count when those models are implemented
        const totalQuestions = 0;
        const activeRounds = 0;

        res.status(200).json({
            success: true,
            data: {
                totalTeams,
                pendingApprovals,
                approvedTeams,
                rejectedTeams,
                totalQuestions,
                activeRounds,
            },
        });
    } catch (error) {
        console.error('Error fetching overview stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message,
        });
    }
};

module.exports = {
    getOverviewStats,
};
