import axios from 'axios';
// Determine backend URL based on current environment
const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const api = axios.create({
    baseURL: backendUrl,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Teams
export async function createTeam(input) {
    const response = await api.post('/teams', input);
    return response.data;
}
export async function getTeamByRegistrationId(registrationId) {
    const response = await api.get(`/teams/${registrationId}`);
    return response.data;
}
// Payments
export async function initiatePayment(registrationId) {
    const response = await api.post('/payments/initiate', { registrationId });
    return response.data;
}
export async function confirmPayment(registrationId, transactionRef) {
    const response = await api.post('/payments/confirm', { registrationId, transactionRef });
    return response.data;
}
export async function failPayment(registrationId) {
    const response = await api.post('/payments/fail', { registrationId });
    return response.data;
}
// Auth
export async function loginAdmin(email, password) {
    const response = await api.post('/admin/auth/login', { email, password });
    return response.data;
}
export async function logoutAdmin() {
    const response = await api.post('/admin/auth/logout');
    return response.data;
}
// Admin Teams
export async function getAllTeams(limit = 50, skip = 0) {
    const response = await api.get('/admin/teams', { params: { limit, skip } });
    return response.data;
}
export async function getTeamDetail(id) {
    const response = await api.get(`/admin/teams/${id}`);
    return response.data;
}
export async function toggleTeamVerification(id) {
    const response = await api.patch(`/admin/teams/${id}/verify`);
    return response.data;
}
export async function searchTeams(type, query) {
    const response = await api.get(`/admin/search/${type}/${query}`);
    return response.data;
}
export async function exportTeamsToExcel() {
    const response = await api.get('/admin/export/excel', {
        responseType: 'blob',
    });
    return response.data;
}
// Health
export async function checkHealth() {
    const response = await api.get('/health');
    return response.data;
}
export default api;
