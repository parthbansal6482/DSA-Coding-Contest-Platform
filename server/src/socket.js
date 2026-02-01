const Team = require('./models/Team');

let io = null;

/**
 * Initialize Socket.IO instance
 */
const initializeSocket = (socketIO) => {
    io = socketIO;
    console.log('Socket.IO initialized');
};

/**
 * Get current leaderboard data
 */
const getLeaderboardData = async () => {
    try {
        const teams = await Team.find({ status: 'approved' })
            .sort({ points: -1 })
            .select('teamName points members sabotageTokens shieldTokens');

        return teams.map((team, index) => ({
            rank: index + 1,
            teamName: team.teamName,
            points: team.points || 0,
            memberCount: team.members.length,
            tokens: {
                sabotage: team.sabotageTokens || 0,
                shield: team.shieldTokens || 0,
            },
        }));
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        return [];
    }
};

/**
 * Broadcast leaderboard update to all connected clients
 */
const broadcastLeaderboardUpdate = async () => {
    if (!io) {
        console.warn('Socket.IO not initialized');
        return;
    }

    try {
        const leaderboard = await getLeaderboardData();
        io.emit('leaderboard:update', leaderboard);
        console.log('Leaderboard update broadcasted to all clients');
    } catch (error) {
        console.error('Error broadcasting leaderboard update:', error);
    }
};

/**
 * Broadcast team stats update to a specific team
 * @param {string} teamId - The team ID to send updates to
 */
const broadcastTeamStatsUpdate = async (teamId) => {
    if (!io) {
        console.warn('Socket.IO not initialized');
        return;
    }

    try {
        const team = await Team.findById(teamId)
            .select('teamName points sabotageTokens shieldTokens');

        if (!team) {
            console.warn(`Team not found: ${teamId}`);
            return;
        }

        // Get team's rank
        const allTeams = await Team.find({ status: 'approved' })
            .sort({ points: -1 })
            .select('_id');
        const rank = allTeams.findIndex(t => t._id.toString() === teamId.toString()) + 1;

        const statsUpdate = {
            teamName: team.teamName,
            points: team.points || 0,
            rank: rank || 0,
            tokens: {
                sabotage: team.sabotageTokens || 0,
                shield: team.shieldTokens || 0,
            },
        };

        // Emit to all clients (they can filter by team name)
        io.emit('team:stats-update', statsUpdate);
        console.log(`Team stats update broadcasted for team: ${team.teamName}`);
    } catch (error) {
        console.error('Error broadcasting team stats update:', error);
    }
};

/**
 * Broadcast submission update to a specific team
 * @param {string} teamId - The team ID
 * @param {object} submission - The submission data
 */
const broadcastSubmissionUpdate = async (teamId, submission) => {
    if (!io) {
        console.warn('Socket.IO not initialized');
        return;
    }

    try {
        const team = await Team.findById(teamId).select('teamName');
        if (!team) {
            console.warn(`Team not found: ${teamId}`);
            return;
        }

        const updateData = {
            teamName: team.teamName,
            questionId: submission.question,
            status: submission.status,
            points: submission.points || 0,
            timestamp: submission.submittedAt,
        };

        // Emit to all clients (they can filter by team name)
        io.emit('submission:update', updateData);
        console.log(`Submission update broadcasted for team: ${team.teamName}, question: ${submission.question}`);
    } catch (error) {
        console.error('Error broadcasting submission update:', error);
    }
};

/**
 * Broadcast cheating violation to all connected admins
 * @param {string} teamName - The name of the team that violated rules
 * @param {string} roundName - The round name
 * @param {string} violationType - The type of violation (e.g., 'tab-switch')
 */
const broadcastCheatingViolation = (teamName, roundName, violationType) => {
    if (!io) return;
    io.emit('cheating:alert', {
        teamName,
        roundName,
        violationType,
        timestamp: new Date(),
    });
    console.log(`Cheating alert broadcasted for team: ${teamName}`);
};

/**
 * Broadcast disqualification status to a specific team
 * @param {string} teamId - The team ID
 * @param {boolean} isDisqualified - New disqualification status
 * @param {string} roundId - The round ID
 */
const broadcastDisqualificationUpdate = async (teamId, isDisqualified, roundId) => {
    if (!io) return;

    try {
        const team = await Team.findById(teamId).select('teamName');
        if (!team) return;

        io.emit('team:disqualification-update', {
            teamName: team.teamName,
            isDisqualified,
            roundId,
        });
        console.log(`Disqualification update broadcasted for team: ${team.teamName}, status: ${isDisqualified}`);
    } catch (error) {
        console.error('Error broadcasting disqualification update:', error);
    }
};

module.exports = {
    initializeSocket,
    broadcastSubmissionUpdate,
    broadcastCheatingViolation,
    broadcastDisqualificationUpdate,
    getLeaderboardData,
};
