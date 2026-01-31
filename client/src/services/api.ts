import axios, { AxiosInstance } from 'axios';
import type { Team, RegisterTeamInput } from '../types/index';

// Determine backend URL based on current environment
// In production on Render, use relative URL since server serves the client
const backendUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:4000/api');

const api: AxiosInstance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Teams
export async function createTeam(input: RegisterTeamInput): Promise<{
  registrationId: string;
  teamName: string;
  status: string;
}> {
  const response = await api.post('/teams', input);
  return response.data;
}

export async function getTeamByRegistrationId(registrationId: string): Promise<Team> {
  const response = await api.get(`/teams/${registrationId}`);
  return response.data;
}

// Payments
export async function initiatePayment(registrationId: string): Promise<{
  sessionId: string;
  amount: number;
  currency: string;
  registrationId: string;
  teamName: string;
  mockPaymentUrl: string;
}> {
  const response = await api.post('/payments/initiate', { registrationId });
  return response.data;
}

export async function confirmPayment(registrationId: string, transactionRef: string): Promise<{
  success: boolean;
  registrationId: string;
  status: string;
  message: string;
}> {
  const response = await api.post('/payments/confirm', { registrationId, transactionRef });
  return response.data;
}

export async function failPayment(registrationId: string): Promise<{
  success: boolean;
  registrationId: string;
  status: string;
  message: string;
}> {
  const response = await api.post('/payments/fail', { registrationId });
  return response.data;
}

// Auth
export async function loginAdmin(email: string, password: string): Promise<{
  token: string;
  message: string;
}> {
  const response = await api.post('/admin/auth/login', { email, password });
  return response.data;
}

export async function logoutAdmin(): Promise<{ message: string }> {
  const response = await api.post('/admin/auth/logout');
  return response.data;
}

// Admin Teams
export async function getAllTeams(
  limit = 50,
  skip = 0
): Promise<{ teams: Team[]; total: number; limit: number; skip: number }> {
  const response = await api.get('/admin/teams', { params: { limit, skip } });
  return response.data;
}

export async function getTeamDetail(id: string): Promise<Team> {
  const response = await api.get(`/admin/teams/${id}`);
  return response.data;
}

export async function toggleTeamVerification(id: string): Promise<{
  _id: string;
  registrationId: string;
  teamName: string;
  verificationStatus: string;
}> {
  const response = await api.patch(`/admin/teams/${id}/verify`);
  return response.data;
}

export async function searchTeams(
  type: 'registrationId' | 'teamName' | 'collegeName',
  query: string
): Promise<{ teams: Team[] }> {
  const response = await api.get(`/admin/search/${type}/${query}`);
  return response.data;
}

export async function exportTeamsToExcel(): Promise<Blob> {
  const response = await api.get('/admin/export/excel', {
    responseType: 'blob',
  });
  return response.data;
}

// Health
export async function checkHealth(): Promise<{
  status: string;
  timestamp: string;
  uptime: number;
  version: string;
}> {
  const response = await api.get('/health');
  return response.data;
}

export default api;
