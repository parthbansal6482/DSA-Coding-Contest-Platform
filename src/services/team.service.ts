import api from './api';

// Get all teams with optional status filter
export const getAllTeams = async (status?: 'pending' | 'approved' | 'rejected') => {
    const params = status ? { status } : {};
    const response = await api.get('/teams', { params });
    return response.data;
};

// Approve a team
export const approveTeam = async (teamId: string) => {
    const response = await api.put(`/teams/${teamId}/approve`);
    return response.data;
};

// Reject a team
export const rejectTeam = async (teamId: string) => {
    const response = await api.put(`/teams/${teamId}/reject`);
    return response.data;
};
