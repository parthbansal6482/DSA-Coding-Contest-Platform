import { io, Socket } from 'socket.io-client';
import { LeaderboardTeam } from './team.service';

const SOCKET_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace('/api', '') || 'http://localhost:5000';

class SocketService {
    private socket: Socket | null = null;
    private leaderboardCallbacks: Set<(data: LeaderboardTeam[]) => void> = new Set();

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
     * Check if socket is connected
     */
    isConnected(): boolean {
        return this.socket?.connected || false;
    }
}

// Export singleton instance
export const socketService = new SocketService();
