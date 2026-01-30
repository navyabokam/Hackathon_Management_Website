import React, { useState } from 'react';
import * as api from '../services/api';
import type { Team } from '../types/index';

export default function Lookup(): React.ReactElement {
  const [registrationId, setRegistrationId] = useState('');
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTeam(null);
    setIsLoading(true);

    try {
      const result = await api.getTeamByRegistrationId(registrationId);
      setTeam(result);
    } catch (err) {
      setError('Registration ID not found');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <a href="/" className="text-blue-600 font-bold text-xl">
            ← Back to Home
          </a>
        </nav>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-20">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registration Lookup</h1>
          <p className="text-gray-600 mb-8">Enter your Registration ID to view your team status.</p>

          <form onSubmit={handleSearch} className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Registration ID</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., HACK-2024-ABC123"
                  value={registrationId}
                  onChange={(e) => setRegistrationId(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-6">{error}</div>
          )}

          {team && (
            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded">
                <h2 className="font-bold text-lg text-gray-900 mb-3">Team Information</h2>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Registration ID:</span>{' '}
                    <span className="font-semibold text-blue-600">{team.registrationId}</span>
                  </p>
                  <p>
                    <span className="text-gray-600">Team Name:</span> <span className="font-semibold">{team.teamName}</span>
                  </p>
                  <p>
                    <span className="text-gray-600">College:</span> <span className="font-semibold">{team.collegeName}</span>
                  </p>
                  <p>
                    <span className="text-gray-600">Team Size:</span> <span className="font-semibold">{team.teamSize}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Registration Status</h3>
                  <div className="text-2xl font-bold">
                    {team.status === 'CONFIRMED' && (
                      <span className="text-green-600">✓ Confirmed</span>
                    )}
                    {team.status === 'PENDING_PAYMENT' && (
                      <span className="text-yellow-600">⏳ Pending Payment</span>
                    )}
                    {team.status === 'CANCELLED' && (
                      <span className="text-red-600">✗ Cancelled</span>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Verification Status</h3>
                  <div className="text-2xl font-bold">
                    {team.verificationStatus === 'Verified' && (
                      <span className="text-green-600">✓ Verified</span>
                    )}
                    {team.verificationStatus === 'Not Verified' && (
                      <span className="text-gray-600">○ Not Verified</span>
                    )}
                  </div>
                </div>
              </div>

              {team.paymentStatus && (
                <div className="p-4 bg-gray-50 rounded border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Payment Status</h3>
                  <p>
                    {team.paymentStatus === 'Success' && (
                      <span className="text-green-600 font-semibold">✓ Successful</span>
                    )}
                    {team.paymentStatus === 'Failed' && (
                      <span className="text-red-600 font-semibold">✗ Failed</span>
                    )}
                    {team.paymentStatus === 'Pending' && (
                      <span className="text-yellow-600 font-semibold">⏳ Pending</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
            <p>
              <strong>Note:</strong> This is a public lookup. Only basic information is shown. For detailed information,
              please log in to the admin dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
