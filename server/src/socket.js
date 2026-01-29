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

module.exports = {
    initializeSocket,
    broadcastLeaderboardUpdate,
    getLeaderboardData,
};
