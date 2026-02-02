const Team = require('../models/Team');
const { generateToken } = require('../utils/jwt');
const { broadcastSabotageAttack } = require('../socket');

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

        // Check if team exists (user is authenticated as a team)
        if (!team) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated as a team. Please log in as a team.',
            });
        }

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
                name: team.teamName,
                teamName: team.teamName,
                members: team.members,
                points: team.points || 0,
                rank: rank || 0,
                sabotageTokens: team.sabotageTokens || 0,
                shieldTokens: team.shieldTokens || 0,
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
            _id: team._id,
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

// @desc    Purchase token (sabotage or shield)
// @route   POST /api/team/purchase-token
// @access  Private (Team)
exports.purchaseToken = async (req, res) => {
    try {
        const { tokenType, cost } = req.body;
        const teamId = req.team._id;

        // Validate token type
        if (!['sabotage', 'shield'].includes(tokenType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid token type. Must be "sabotage" or "shield"',
            });
        }

        // Validate cost
        if (!cost || cost <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid cost amount',
            });
        }

        // Get fresh team data
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found',
            });
        }

        // Check if team has enough points
        if (team.points < cost) {
            return res.status(400).json({
                success: false,
                message: `Insufficient points. You have ${team.points} points but need ${cost} points.`,
                currentPoints: team.points,
                requiredPoints: cost,
            });
        }

        // Deduct points and add token
        team.points -= cost;
        if (tokenType === 'sabotage') {
            team.sabotageTokens += 1;
        } else {
            team.shieldTokens += 1;
        }

        await team.save();

        // Get updated rank
        const allTeams = await Team.find({ status: 'approved' })
            .sort({ points: -1 })
            .select('_id points');
        const rank = allTeams.findIndex(t => t._id.toString() === team._id.toString()) + 1;

        res.status(200).json({
            success: true,
            message: `Successfully purchased ${tokenType} token`,
            data: {
                teamName: team.teamName,
                points: team.points,
                rank,
                tokens: {
                    sabotage: team.sabotageTokens || 0,
                    shield: team.shieldTokens || 0,
                },
            },
        });
    } catch (error) {
        console.error('Error purchasing token:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing token purchase',
            error: error.message,
        });
    }
};

// @desc    Activate shield protection
// @route   POST /api/team/activate-shield
// @access  Private (Team)
exports.activateShield = async (req, res) => {
    try {
        const teamId = req.team._id;

        // Get fresh team data
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found',
            });
        }

        // Check if team has shield tokens
        if (team.shieldTokens <= 0) {
            return res.status(400).json({
                success: false,
                message: 'No shield tokens available',
            });
        }

        // Check if shield is already active
        if (team.shieldActive && team.shieldExpiresAt && new Date() < team.shieldExpiresAt) {
            return res.status(400).json({
                success: false,
                message: 'Shield is already active',
                expiresAt: team.shieldExpiresAt,
            });
        }

        // Check cooldown
        if (team.shieldCooldownUntil && new Date() < team.shieldCooldownUntil) {
            return res.status(400).json({
                success: false,
                message: 'Shield is on cooldown',
                cooldownUntil: team.shieldCooldownUntil,
            });
        }

        // Activate shield
        team.shieldTokens -= 1;
        team.shieldActive = true;
        team.shieldExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        team.shieldCooldownUntil = new Date(Date.now() + 15 * 60 * 1000); // 5 minutes after expiration (15 mins total)

        await team.save();

        res.status(200).json({
            success: true,
            message: 'Shield activated successfully',
            data: {
                shieldActive: team.shieldActive,
                shieldExpiresAt: team.shieldExpiresAt,
                shieldCooldownUntil: team.shieldCooldownUntil,
                shieldTokens: team.shieldTokens,
            },
        });
    } catch (error) {
        console.error('Error activating shield:', error);
        res.status(500).json({
            success: false,
            message: 'Error activating shield',
            error: error.message,
        });
    }
};

// @desc    Launch sabotage attack on target team
// @route   POST /api/team/launch-sabotage
// @access  Private (Team)
exports.launchSabotage = async (req, res) => {
    try {
        const { targetTeamId, sabotageType } = req.body;
        const teamId = req.team._id;

        // Validate sabotage type
        const validTypes = ['blackout', 'typing-delay', 'format-chaos', 'ui-glitch'];
        if (!validTypes.includes(sabotageType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid sabotage type',
            });
        }

        // Get attacker team
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found',
            });
        }

        // Check if team has sabotage tokens
        if (team.sabotageTokens <= 0) {
            return res.status(400).json({
                success: false,
                message: 'No sabotage tokens available',
            });
        }

        // Check cooldown
        if (team.sabotageCooldownUntil && new Date() < team.sabotageCooldownUntil) {
            return res.status(400).json({
                success: false,
                message: 'Sabotage is on cooldown',
                cooldownUntil: team.sabotageCooldownUntil,
            });
        }

        // Get target team
        const targetTeam = await Team.findById(targetTeamId);
        if (!targetTeam) {
            return res.status(404).json({
                success: false,
                message: 'Target team not found',
            });
        }

        // Check if target has active shield
        if (targetTeam.shieldActive && targetTeam.shieldExpiresAt && new Date() < targetTeam.shieldExpiresAt) {
            return res.status(400).json({
                success: false,
                message: `${targetTeam.teamName} has an active shield! Your sabotage was blocked.`,
                targetHasShield: true,
            });
        }

        // Deduct token and set cooldown
        team.sabotageTokens -= 1;
        team.sabotageCooldownUntil = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        await team.save();

        // Broadcast sabotage effect via WebSocket
        await broadcastSabotageAttack(targetTeamId, team.teamName, sabotageType);

        res.status(200).json({
            success: true,
            message: `Successfully sabotaged ${targetTeam.teamName} with ${sabotageType}`,
            data: {
                targetTeam: targetTeam.teamName,
                sabotageType,
                sabotageTokens: team.sabotageTokens,
                cooldownUntil: team.sabotageCooldownUntil,
            },
        });
    } catch (error) {
        console.error('Error launching sabotage:', error);
        res.status(500).json({
            success: false,
            message: 'Error launching sabotage',
            error: error.message,
        });
    }
};
