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
    let retryCount = 0;
    const maxRetries = 5; // Try up to 5 times with 1 second delay
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

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
          // Retry if team not found (might still be syncing from database)
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Team not found, retrying (${retryCount}/${maxRetries})...`);
            timeoutId = setTimeout(loadTeam, 1000); // Retry after 1 second
            return;
          }
          setError('Team not found. Please check your registration ID and try again.');
          setIsLoading(false);
          return;
        }

        // Accept both PENDING_PAYMENT (initial registration) and CONFIRMED (after payment)
        if (teamData.status !== 'CONFIRMED' && teamData.status !== 'PENDING_PAYMENT') {
          setError(`This team registration has an unexpected status: ${teamData.status}. Please contact support.`);
          setIsLoading(false);
          return;
        }

        setTeam(teamData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading team:', err);
        // Retry on network errors
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Error loading team, retrying (${retryCount}/${maxRetries})...`);
          timeoutId = setTimeout(loadTeam, 1000); // Retry after 1 second
          return;
        }
        setError(`Failed to load registration details: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    };

    loadTeam();

    // Cleanup timeout on component unmount
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
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
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                New Registration
              </button>
            </div>
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
    <div className={`min-h-screen bg-gradient-to-b ${team.status === 'CONFIRMED' ? 'from-green-50 to-green-100' : 'from-yellow-50 to-amber-100'}`}>
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
            <div className={`text-7xl mb-4`}>
              {team.status === 'CONFIRMED' ? '✅' : '📝'}
            </div>
            <h1 className={`text-4xl font-bold mb-2 ${team.status === 'CONFIRMED' ? 'text-green-600' : 'text-amber-600'}`}>
              {team.status === 'CONFIRMED' ? 'Registration Confirmed!' : 'Registration Initiated'}
            </h1>
            <p className="text-gray-600">
              {team.status === 'CONFIRMED' 
                ? 'Thank you for registering for ForgeAscend v1.0.' 
                : 'Your registration has been successfully initiated and is under verification.'}
            </p>
          </div>

          <div className={`bg-gradient-to-r ${team.status === 'CONFIRMED' ? 'from-blue-50 to-blue-100 border-blue-200' : 'from-yellow-50 to-yellow-100 border-yellow-200'} p-6 rounded-lg mb-8 border-2`}>
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
                <span className="text-gray-700">University:</span>
                <span className="font-semibold">{team.collegeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Team Size:</span>
                <span className="font-semibold">{team.teamSize}</span>
              </div>
              <div className="border-t pt-3">
                <span className="text-gray-700">Team Leader:</span>
                <p className="text-sm text-gray-600 mt-1">{team.participant1Name}</p>
                <p className="text-sm text-gray-600">{team.participant1Email}</p>
              </div>
              {(team.participant2Name || team.participant3Name || team.participant4Name) && (
                <div className="border-t pt-3">
                  <span className="text-gray-700">Team Members:</span>
                  <ul className="mt-2 ml-4 space-y-1">
                    {team.participant2Name && team.participant2Name.trim() && (
                      <li className="text-sm text-gray-600">
                        • {team.participant2Name} ({team.participant2Email})
                      </li>
                    )}
                    {team.participant3Name && team.participant3Name.trim() && (
                      <li className="text-sm text-gray-600">
                        • {team.participant3Name} ({team.participant3Email})
                      </li>
                    )}
                    {team.participant4Name && team.participant4Name.trim() && (
                      <li className="text-sm text-gray-600">
                        • {team.participant4Name} ({team.participant4Email})
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {team.status === 'PENDING_PAYMENT' && (
            <div className="bg-yellow-50 border border-yellow-300 rounded p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>⏳ Important:</strong> Your registration is currently under verification.
                Once approved, you will receive a confirmation email.
              </p>
            </div>
          )}

          {team.status === 'CONFIRMED' && (
            <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>✉️ Email Sent:</strong> A confirmation email with all the details has been sent to your
                team leader's email address.
              </p>
            </div>
          )}

          <div className="bg-purple-50 border border-purple-200 rounded p-4 mb-6">
            <p className="text-sm text-purple-800">
              <strong>🤝 Join Our Community:</strong> Follow us for updates, announcements, and more information about ForgeAscend v1.0.
              Stay connected with fellow participants!
            </p>
          </div>

          <div className="space-y-3">
            <a
              href="/"
              className="block px-6 py-3 text-gray-700 border border-gray-300 text-center rounded hover:bg-gray-50"
            >
              Back to Home
            </a>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
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
