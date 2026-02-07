import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { setAdminSecretKey, clearAdminSecretKey } from '../services/api';
import type { Team } from '../types/index';

// Admin secret key (should match backend)
const ADMIN_SECRET_KEY = 'forgeascend-9XK';

export default function AdminDashboard(): React.ReactElement {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'registrationId' | 'teamName' | 'collegeName'>('teamName');
  const [isSearching, setIsSearching] = useState(false);

  // Set the secret key when component mounts
  useEffect(() => {
    setAdminSecretKey(ADMIN_SECRET_KEY);
    loadTeams();
  }, []);

  const loadTeams = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await api.getAllTeams(50, 0);
      setTeams(result.teams);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load teams';
      setError(errorMsg);
      console.error('Error loading teams:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) {
      loadTeams();
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const result = await api.searchTeams(searchType, searchQuery);
      setTeams(result.teams);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Search failed';
      setError(`Search Error: ${errorMsg}`);
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logoutAdmin();
      localStorage.removeItem('authToken');
      clearAdminSecretKey();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setError(null);
      const blob = await api.exportTeamsToExcel();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `teams_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to download Excel file';
      setError(`Download Error: ${errorMsg}`);
      console.error('Download error:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">✓ Confirmed</span>;
      case 'PENDING_PAYMENT':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">⏳ Pending</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">✗ Cancelled</span>;
      default:
        return null;
    }
  };

  const getPaymentBadge = (status?: string) => {
    switch (status) {
      case 'Success':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm">Success</span>;
      case 'Failed':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm">Failed</span>;
      case 'Pending':
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm">Pending</span>;
      default:
        return null;
    }
  };

  const getVerificationBadge = (status: string) => {
    if (status === 'Verified') {
      return <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-semibold">✓ Verified</span>;
    }
    return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm">Not Verified</span>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg">Loading dashboard...</div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-800">Error</h3>
                <p className="mt-2 text-sm text-red-700">
                  {error}
                </p>
                <p className="mt-3 text-sm text-red-600">
                  💡 <strong>Tip:</strong> Try refreshing the page or check your connection.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg text-gray-900">Search Teams</h2>
            <button
              onClick={handleDownloadExcel}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold text-sm"
            >
              ⬇️ Download Excel
            </button>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded"
            >
              <option value="teamName">Team Name</option>
              <option value="collegeName">College Name</option>
              <option value="registrationId">Registration ID</option>
            </select>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              onClick={loadTeams}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
            >
              Reset
            </button>
          </form>
        </div>

        {/* Teams List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Registration ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Team Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">College</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Size</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Payment</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Verification</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {teams.map((team) => (
                  <tr key={team._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-blue-600">{team.registrationId}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{team.teamName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{team.collegeName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{team.teamSize}</td>
                    <td className="px-6 py-4">{getStatusBadge(team.status)}</td>
                    <td className="px-6 py-4">{getPaymentBadge(team.paymentStatus)}</td>
                    <td className="px-6 py-4">{getVerificationBadge(team.verificationStatus)}</td>
                    <td className="px-6 py-4">
                      <a
                        href={`/admin/forgeascend-9XK/teams/${team._id}`}
                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {teams.length === 0 && (
            <div className="p-6 text-center text-gray-600">
              No teams found.{' '}
              {searchQuery && (
                <>
                  Try a different search or{' '}
                  <button onClick={loadTeams} className="text-blue-600 hover:text-blue-700">
                    load all teams
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
