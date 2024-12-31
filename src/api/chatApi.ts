import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const chatApi = {
    createSession: async (userId: string) => {
        const response = await axios.post(`${API_BASE_URL}/sessions`, { userId });
        return response.data;
    },

    joinSession: async (sessionId: string, userId: string, username: string) => {
        const response = await axios.post(`${API_BASE_URL}/sessions/${sessionId}/join`, {
            userId,
            username
        });
        return response.data;
    },

    getSessionMessages: async (sessionId: string) => {
        const response = await axios.get(`${API_BASE_URL}/sessions/${sessionId}/messages`);
        return response.data;
    }
};