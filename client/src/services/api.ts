import axios, { AxiosInstance } from 'axios';
import type { Team, RegisterTeamInput } from '../types/index';

// Admin secret key (stored when accessing admin panel)
let adminSecretKey: string | null = null;

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

// Add interceptor to include secret key in admin requests
api.interceptors.request.use((config) => {
  if (adminSecretKey && config.url?.includes('/admin')) {
    // Add secret key as query parameter
    const separator = config.url.includes('?') ? '&' : '?';
    config.url += `${separator}secretKey=${adminSecretKey}`;
  }
  return config;
});

// Add interceptor to handle errors and extract error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract meaningful error message from backend response
    let errorMessage = 'Something went wrong. Please try again.';

    if (error.response) {
      // Server responded with error status
      const data = error.response.data as any;
      errorMessage = data?.error || data?.message || error.response.statusText || errorMessage;
    } else if (error.request) {
      // Request made but no server response
      errorMessage = 'No response from server. Please check your connection.';
    } else if (error.message) {
      // Error in request setup
      errorMessage = error.message;
    }

    // Create custom error with proper message
    const customError = new Error(errorMessage);
    customError.name = 'APIError';
    (customError as any).status = error.response?.status;
    (customError as any).originalError = error;

    return Promise.reject(customError);
  }
);

// Function to extract user-friendly error message
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}

// Function to get HTTP status code from error
export function getErrorStatus(error: unknown): number | undefined {
  if (error instanceof Error && (error as any).status) {
    return (error as any).status;
  }
  return undefined;
}

// Function to set the admin secret key
export function setAdminSecretKey(secretKey: string): void {
  adminSecretKey = secretKey;
}

// Function to clear the admin secret key
export function clearAdminSecretKey(): void {
  adminSecretKey = null;
}

// Teams
export async function createTeam(input: RegisterTeamInput): Promise<{
  registrationId: string;
  teamName: string;
  status: string;
}> {
  console.log('Sending team registration data:', input);
  const response = await api.post('/teams', input);
  console.log('Team registration response:', response.data);
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
