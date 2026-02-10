const Team = require('./models/Team');

let io = null;
const activeTeams = new Map(); // teamId -> socketId

/**
 * Initialize Socket.IO instance
 */
const initializeSocket = (socketIO) => {
    io = socketIO;
    console.log('Socket.IO initialized');
};

/**
 * Check if a team is already active on another device
 * @param {string} teamId 
 */
const isTeamActive = (teamId) => {
    const tid = teamId.toString();
    const activeSocketId = activeTeams.get(tid);
    console.log(`Checking if team ${tid} is active. Found socket ID: ${activeSocketId}`);

    if (activeSocketId && io) {
        // Double check if the socket actually exists/is connected
        const socket = io.sockets.sockets.get(activeSocketId);
        if (socket && socket.connected) {
            console.log(`Team ${tid} is active (socket ${activeSocketId} connected)`);
            return true;
        }
        console.log(`Team ${tid} socket ${activeSocketId} found but not connected. Cleaning up.`);
        // If not connected, clean up
        activeTeams.delete(tid);
    } else {
        console.log(`Team ${tid} is not active (no socket or no io)`);
    }
    return false;
};

/**
 * Add an active team session
 */
const addActiveTeam = (teamId, socketId) => {
    activeTeams.set(teamId.toString(), socketId);
    console.log(`Team session registered: ${teamId} -> ${socketId}`);
};

/**
 * Remove an active team session by socket ID
 */
const removeActiveTeam = (socketId) => {
    for (const [teamId, sid] of activeTeams.entries()) {
        if (sid === socketId) {
            activeTeams.delete(teamId);
            console.log(`Team session removed: ${teamId} (socket: ${socketId})`);
            break;
        }
    }
};

/**
 * Get current leaderboard data
 */
const getLeaderboardData = async () => {
    try {
        const teams = await Team.find({ status: 'approved' })
            .sort({ score: -1 })
            .select('teamName points score members sabotageTokens shieldTokens');

        return teams.map((team, index) => ({
            _id: team._id,
            rank: index + 1,
            teamName: team.teamName,
            points: team.points || 0,
            score: team.score || 0,
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
            .select('teamName points score sabotageTokens shieldTokens sabotageCooldownUntil shieldCooldownUntil shieldActive shieldExpiresAt activeSabotages');

        if (!team) {
            console.warn(`Team not found: ${teamId}`);
            return;
        }

        // Get team's rank
        const allTeams = await Team.find({ status: 'approved' })
            .sort({ score: -1 })
            .select('_id');
        const rank = allTeams.findIndex(t => t._id.toString() === teamId.toString()) + 1;

        const statsUpdate = {
            teamName: team.teamName,
            points: team.points || 0,
            score: team.score || 0,
            rank: rank || 0,
            tokens: {
                sabotage: team.sabotageTokens || 0,
                shield: team.shieldTokens || 0,
            },
            sabotageCooldownUntil: team.sabotageCooldownUntil,
            shieldCooldownUntil: team.shieldCooldownUntil,
            shieldActive: team.shieldActive,
            shieldExpiresAt: team.shieldExpiresAt,
            activeSabotages: team.activeSabotages || [],
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
 * @param {string} action - 'start' or 'end'
 * @param {number} duration - The duration in seconds
 */
const broadcastCheatingViolation = (teamName, roundName, violationType, action, duration) => {
    if (!io) return;
    io.emit('cheating:alert', {
        teamName,
        roundName,
        violationType,
        action,
        duration,
        timestamp: new Date(),
    });
    console.log(`Cheating alert broadcasted for team: ${teamName} (${action}${duration ? `, ${duration}s` : ''})`);
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

/**
 * Broadcast sabotage attack to a specific team
 * @param {string} targetTeamId - The team ID being sabotaged
 * @param {string} attackerTeamName - The name of the team launching the attack
 * @param {string} sabotageType - The type of sabotage
 */
const broadcastSabotageAttack = async (targetTeamId, attackerTeamName, sabotageType) => {
    if (!io) return;

    try {
        const targetTeam = await Team.findById(targetTeamId).select('teamName');
        if (!targetTeam) return;

        io.emit('team:sabotage', {
            targetTeamName: targetTeam.teamName,
            attackerTeamName,
            type: sabotageType,
            timestamp: new Date(),
        });
        console.log(`Sabotage attack broadcasted: ${sabotageType} from ${attackerTeamName} to ${targetTeam.teamName}`);
    } catch (error) {
        console.error('Error broadcasting sabotage attack:', error);
    }
};

/**
 * Broadcast round status update to all connected clients
 * @param {object} round - The round data
 */
const broadcastRoundUpdate = (round) => {
    if (!io) return;
    io.emit('round:update', {
        _id: round._id,
        name: round.name,
        status: round.status,
        startTime: round.startTime,
        endTime: round.endTime,
        duration: round.duration,
    });
    console.log(`Round update broadcasted: ${round.name} (${round.status})`);
};

module.exports = {
    initializeSocket,
    broadcastSubmissionUpdate,
    broadcastCheatingViolation,
    broadcastDisqualificationUpdate,
    broadcastSabotageAttack,
    broadcastTeamStatsUpdate,
    broadcastLeaderboardUpdate,
    getLeaderboardData,
    broadcastRoundUpdate,
    isTeamActive,
    addActiveTeam,
    removeActiveTeam,
};
