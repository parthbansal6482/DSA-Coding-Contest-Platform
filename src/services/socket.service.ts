import { io, Socket } from 'socket.io-client';
import { LeaderboardTeam } from './team.service';

const SOCKET_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace('/api', '') || 'http://localhost:5000';

export interface TeamStatsUpdate {
    teamName: string;
    points: number;
    rank: number;
    tokens: {
        sabotage: number;
        shield: number;
    };
}

export interface SubmissionUpdate {
    teamName: string;
    questionId: string;
    status: string;
    points: number;
    timestamp: string;
}

export interface CheatingAlert {
    teamName: string;
    roundName: string;
    violationType: string;
    timestamp: string;
}

export interface DisqualificationUpdate {
    teamName: string;
    isDisqualified: boolean;
    roundId: string;
}

class SocketService {
    private socket: Socket | null = null;
    private leaderboardCallbacks: Set<(data: LeaderboardTeam[]) => void> = new Set();
    private teamStatsCallbacks: Set<(data: TeamStatsUpdate) => void> = new Set();
    private submissionCallbacks: Set<(data: SubmissionUpdate) => void> = new Set();
    private cheatingAlertCallbacks: Set<(data: CheatingAlert) => void> = new Set();
    private disqualificationCallbacks: Set<(data: DisqualificationUpdate) => void> = new Set();
    private alertBuffer: CheatingAlert[] = [];

    constructor() {
        this.loadAlertBuffer();
    }

    private loadAlertBuffer() {
        try {
            const saved = localStorage.getItem('cheating_alerts');
            if (saved) {
                this.alertBuffer = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading alert buffer:', error);
            this.alertBuffer = [];
        }
    }

    private saveAlertBuffer() {
        try {
            localStorage.setItem('cheating_alerts', JSON.stringify(this.alertBuffer));
        } catch (error) {
            console.error('Error saving alert buffer:', error);
        }
    }

    /**
     * Connect to WebSocket server
     */
    connect() {
        if (this.socket?.connected) {
            return;
        }

        this.socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        this.socket.on('connect', () => {
            console.log('WebSocket connected:', this.socket?.id);
        });

        this.socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });

        this.socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
        });

        // Listen for leaderboard updates
        this.socket.on('leaderboard:update', (data: LeaderboardTeam[]) => {
            console.log('Leaderboard update received:', data.length, 'teams');
            this.leaderboardCallbacks.forEach((callback) => callback(data));
        });

        // Listen for team stats updates
        this.socket.on('team:stats-update', (data: TeamStatsUpdate) => {
            console.log('Team stats update received:', data.teamName);
            this.teamStatsCallbacks.forEach((callback) => callback(data));
        });

        // Listen for submission updates
        this.socket.on('submission:update', (data: SubmissionUpdate) => {
            console.log('Submission update received:', data.questionId, data.status);
            this.submissionCallbacks.forEach((callback) => callback(data));
        });

        // Listen for cheating alerts (Admin)
        this.socket.on('cheating:alert', (data: CheatingAlert) => {
            console.log('Cheating alert received:', data.teamName, data.violationType);

            // Add to buffer
            this.alertBuffer = [data, ...this.alertBuffer].slice(0, 50);
            this.saveAlertBuffer();

            this.cheatingAlertCallbacks.forEach((callback) => callback(data));
        });

        // Listen for disqualification updates (Team)
        this.socket.on('team:disqualification-update', (data: DisqualificationUpdate) => {
            console.log('Disqualification update received:', data.teamName, data.isDisqualified);
            this.disqualificationCallbacks.forEach((callback) => callback(data));
        });
    }

    /**
     * Disconnect from WebSocket server
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    /**
     * Subscribe to leaderboard updates
     */
    onLeaderboardUpdate(callback: (data: LeaderboardTeam[]) => void) {
        this.leaderboardCallbacks.add(callback);

        // Return unsubscribe function
        return () => {
            this.leaderboardCallbacks.delete(callback);
        };
    }

    /**
     * Subscribe to team stats updates
     */
    onTeamStatsUpdate(callback: (data: TeamStatsUpdate) => void) {
        this.teamStatsCallbacks.add(callback);

        // Return unsubscribe function
        return () => {
            this.teamStatsCallbacks.delete(callback);
        };
    }

    /**
     * Subscribe to submission updates
     */
    onSubmissionUpdate(callback: (data: SubmissionUpdate) => void) {
        this.submissionCallbacks.add(callback);

        // Return unsubscribe function
        return () => {
            this.submissionCallbacks.delete(callback);
        };
    }

    /**
     * Subscribe to cheating alerts (Admin only)
     */
    onCheatingAlert(callback: (data: CheatingAlert) => void) {
        this.cheatingAlertCallbacks.add(callback);
        return () => {
            this.cheatingAlertCallbacks.delete(callback);
        };
    }

    /**
     * Subscribe to disqualification updates
     */
    onDisqualificationUpdate(callback: (data: DisqualificationUpdate) => void) {
        this.disqualificationCallbacks.add(callback);
        return () => {
            this.disqualificationCallbacks.delete(callback);
        };
    }

    /**
     * Report a rules violation from the client
     */
    reportViolation(teamName: string, roundName: string, violationType: string) {
        if (this.socket?.connected) {
            this.socket.emit('cheating:violation', { teamName, roundName, violationType });
        }
    }

    /**
     * Get recent alerts from buffer
     */
    getRecentAlerts(): CheatingAlert[] {
        return [...this.alertBuffer];
    }

    /**
     * Clear all alerts from buffer and persistence
     */
    clearAlertBuffer() {
        this.alertBuffer = [];
        localStorage.removeItem('cheating_alerts');
    }

    /**
     * Check if socket is connected
     */
    isConnected(): boolean {
        return this.socket?.connected || false;
    }
}

// Export singleton instance
export const socketService = new SocketService();
