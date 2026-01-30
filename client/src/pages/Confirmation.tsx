import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import type { Team } from '../types/index';

export default function Confirmation(): React.ReactElement {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const registrationId = searchParams.get('registrationId');

  useEffect(() => {
    const loadTeam = async () => {
      if (!registrationId) {
        setError('No registration ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const teamData = await api.getTeamByRegistrationId(registrationId);
        console.log('Team data received:', teamData);

        if (!teamData) {
          setError('Team not found');
          setIsLoading(false);
          return;
        }

        if (teamData.status !== 'CONFIRMED') {
          setError(`This team registration is not confirmed. Current status: ${teamData.status}. Payment may have failed.`);
          setIsLoading(false);
          return;
        }

        setTeam(teamData);
      } catch (err) {
        console.error('Error loading team:', err);
        setError(`Failed to load registration details: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeam();
  }, [registrationId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg">Loading confirmation...</div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100">
        <header className="bg-white shadow">
          <nav className="max-w-7xl mx-auto px-4 py-6">
            <a href="/" className="text-blue-600 font-bold text-xl">
              ← Back to Home
            </a>
          </nav>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-20">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-6">❌</div>
            <h1 className="text-3xl font-bold text-red-600 mb-4">Confirmation Failed</h1>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100">
        <header className="bg-white shadow">
          <nav className="max-w-7xl mx-auto px-4 py-6">
            <a href="/" className="text-blue-600 font-bold text-xl">
              ← Back to Home
            </a>
          </nav>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-20">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Team Not Found</h2>
            <p className="text-gray-700 mb-6">
              Unable to load team information. The registration ID may be invalid or the team data may not exist.
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Registration ID: <code className="bg-gray-100 px-2 py-1 rounded">{registrationId}</code>
            </p>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go Back to Registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 py-6">
          <a href="/" className="text-blue-600 font-bold text-xl">
            ← Back to Home
          </a>
        </nav>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-20">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">✅</div>
            <h1 className="text-4xl font-bold text-green-600 mb-2">Registration Confirmed!</h1>
            <p className="text-gray-600">Thank you for registering for the College Hackathon.</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg mb-8 border border-blue-200">
            <h2 className="font-semibold text-gray-900 text-center mb-3">Your Registration ID</h2>
            <div className="text-center">
              <div className="inline-block bg-white px-6 py-3 rounded border-2 border-blue-600">
                <p className="text-3xl font-bold text-blue-600 font-mono">{team.registrationId}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center mt-3">
              Keep this ID safe. You'll need it to verify your team on the day of the hackathon.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Team Details</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Team Name:</span>
                <span className="font-semibold">{team.teamName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">College:</span>
                <span className="font-semibold">{team.collegeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Team Members:</span>
                <span className="font-semibold">{team.teamSize}</span>
              </div>
              <div className="border-t pt-3">
                <span className="text-gray-700">Members:</span>
                <ul className="mt-2 ml-4 space-y-1">
                  {team.participants.map((p, i) => (
                    <li key={i} className="text-sm text-gray-600">
                      • {p.fullName} ({p.email})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Email Confirmation:</strong> A confirmation email with all the details has been sent to your
              team leader's email address.
            </p>
          </div>

          <div className="space-y-3">
            <a
              href="/lookup"
              className="block px-6 py-3 bg-blue-600 text-white text-center font-semibold rounded hover:bg-blue-700"
            >
              View Registration Status
            </a>
            <a
              href="/"
              className="block px-6 py-3 text-gray-700 border border-gray-300 text-center rounded hover:bg-gray-50"
            >
              Back to Home
            </a>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            <p>
              <strong>Next Steps:</strong> Make sure all team members arrive on time on the day of the hackathon.
              Bring a valid ID and be ready to verify using your Registration ID.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
