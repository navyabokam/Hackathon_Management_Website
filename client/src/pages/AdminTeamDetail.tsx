import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../services/api';
import { setAdminSecretKey } from '../services/api';
import type { Team } from '../types/index';

// Admin secret key (should match backend)
const ADMIN_SECRET_KEY = 'forgeascend-9XK';

export default function AdminTeamDetail(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Set the secret key when component mounts
  useEffect(() => {
    setAdminSecretKey(ADMIN_SECRET_KEY);
    if (id) {
      loadTeam();
    }
  }, [id]);

  const loadTeam = async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const teamData = await api.getTeamDetail(id);
      setTeam(teamData);
    } catch (err) {
      setError('Failed to load team details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVerification = async () => {
    if (!id) return;

    setIsVerifying(true);
    setError(null);

    try {
      const result = await api.toggleTeamVerification(id);
      setTeam((prev) =>
        prev
          ? {
              ...prev,
              verificationStatus: result.verificationStatus as 'Verified' | 'Not Verified',
            }
          : null
      );
    } catch (err) {
      setError('Failed to update verification status');
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg">Loading team details...</div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <a href="/admin/forgeascend-9XK/dashboard" className="text-blue-600 font-bold text-lg">
              ← Back to Dashboard
            </a>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-red-600 font-semibold mb-4">{error || 'Team not found'}</p>
            <a href="/admin/forgeascend-9XK/dashboard" className="text-blue-600 hover:text-blue-700">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <a href="/admin/forgeascend-9XK/dashboard" className="text-blue-600 font-bold text-lg">
            ← Back to Dashboard
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Team Details</h1>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="font-semibold text-gray-900 text-lg mb-3">Registration ID</h2>
              <p className="text-2xl font-mono text-blue-600">{team.registrationId}</p>
            </div>

            <div>
              <h2 className="font-semibold text-gray-900 text-lg mb-3">Team Name</h2>
              <p className="text-xl text-gray-900">{team.teamName}</p>
            </div>

            <div>
              <h2 className="font-semibold text-gray-900 text-lg mb-3">College</h2>
              <p className="text-gray-700">{team.collegeName}</p>
            </div>

            <div>
              <h2 className="font-semibold text-gray-900 text-lg mb-3">Team Size</h2>
              <p className="text-gray-700">{team.teamSize} members</p>
            </div>

            <div>
              <h2 className="font-semibold text-gray-900 text-lg mb-3">Registration Status</h2>
              {getStatusBadge(team.status)}
            </div>

            <div>
              <h2 className="font-semibold text-gray-900 text-lg mb-3">Payment Status</h2>
              {getPaymentBadge(team.paymentStatus)}
            </div>
          </div>

          {/* Verification Section */}
          <div className="border-t pt-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-gray-900">Verification Status</h2>
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold">
                  {team.verificationStatus === 'Verified' ? (
                    <span className="text-green-600">✓ Verified</span>
                  ) : (
                    <span className="text-gray-600">Not Verified</span>
                  )}
                </span>
                <button
                  onClick={handleToggleVerification}
                  disabled={isVerifying}
                  className={`px-6 py-2 rounded text-white font-semibold ${
                    team.verificationStatus === 'Verified'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-green-600 hover:bg-green-700'
                  } disabled:bg-gray-400`}
                >
                  {isVerifying
                    ? 'Updating...'
                    : team.verificationStatus === 'Verified'
                      ? 'Unverify'
                      : 'Mark Verified'}
                </button>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="border-t pt-6 mb-6">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Team Members</h2>
            <div className="space-y-4">
              {/* Participant 1 (Team Leader) */}
              <div className="bg-blue-50 p-4 rounded border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-2">Participant 1 (Team Leader)</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p>
                    <span className="font-semibold">Name:</span> {team.participant1Name}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {team.participant1Email}
                  </p>
                  <p>
                    <span className="font-semibold">Mobile:</span> {team.leaderPhone}
                  </p>
                </div>
              </div>

              {/* Participant 2 */}
              {team.participant2Name && team.participant2Name.trim() && (
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Participant 2</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                      <span className="font-semibold">Name:</span> {team.participant2Name}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span> {team.participant2Email}
                    </p>
                  </div>
                </div>
              )}

              {/* Participant 3 */}
              {team.participant3Name && team.participant3Name.trim() && (
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Participant 3</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                      <span className="font-semibold">Name:</span> {team.participant3Name}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span> {team.participant3Email}
                    </p>
                  </div>
                </div>
              )}

              {/* Participant 4 */}
              {team.participant4Name && team.participant4Name.trim() && (
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Participant 4</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p>
                      <span className="font-semibold">Name:</span> {team.participant4Name}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span> {team.participant4Email}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="border-t pt-6">
            <h2 className="font-bold text-lg text-gray-900 mb-3">Payment Information</h2>
            <div className="bg-gray-50 p-4 rounded space-y-2">
              <p className="text-gray-700">
                <span className="font-semibold">UTR ID:</span> {team.utrId}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Payment Screenshot:</span>{' '}
                <a href={team.paymentScreenshot} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  View Screenshot
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
