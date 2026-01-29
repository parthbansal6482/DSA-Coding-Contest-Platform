import api from './api';

interface OverviewStats {
    totalTeams: number;
    pendingApprovals: number;
    approvedTeams: number;
    rejectedTeams: number;
    totalQuestions: number;
    activeRounds: number;
}

/**
 * Get overview statistics for admin dashboard
 */
export const getOverviewStats = async (): Promise<OverviewStats> => {
    const response = await api.get('/stats/overview');
    return response.data.data;
};
