import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { RegisterTeamSchema, type RegisterTeamInput } from '../schemas/index';
import * as api from '../services/api';

const PRICING = {
  '1': 349,   // Solo
  '2': 599,   // Duo
  '3': 999,   // Trio
  '4': 999,   // Squad
};

export default function Register(): React.ReactElement {
  const [apiError, setApiError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTeamSize, setSelectedTeamSize] = useState<string>('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterTeamInput>({
    resolver: zodResolver(RegisterTeamSchema),
    defaultValues: {
      teamName: '',
      collegeName: '',
      teamSize: '',
      participant1Name: '',
      participant1Email: '',
      leaderPhone: '',
      participant2Name: '',
      participant2Email: '',
      participant3Name: '',
      participant3Email: '',
      participant4Name: '',
      participant4Email: '',
      utrId: '',
      paymentScreenshot: '',
      confirmation: false,
    },
  });

  const getErrorTitle = (errorMsg: string): string => {
    if (errorMsg.toLowerCase().includes('duplicate') || errorMsg.toLowerCase().includes('already')) {
      return 'Duplicate Entry';
    }
    if (errorMsg.toLowerCase().includes('email')) {
      return 'Email Error';
    }
    if (errorMsg.toLowerCase().includes('phone') || errorMsg.toLowerCase().includes('mobile')) {
      return 'Phone Number Error';
    }
    if (errorMsg.toLowerCase().includes('network') || errorMsg.toLowerCase().includes('connection')) {
      return 'Connection Error';
    }
    if (errorMsg.toLowerCase().includes('timeout')) {
      return 'Request Timeout';
    }
    return 'Registration Error';
  };

  const onSubmit = async (data: RegisterTeamInput) => {
    setApiError(null);
    setErrorDetails(null);
    setIsLoading(true);
    try {
      console.log('Submitting registration:', data);
      const result = await api.createTeam(data);
      console.log('Registration successful:', result);
      // Navigate to confirmation page with registration ID
      navigate(`/confirmation?registrationId=${result.registrationId}`);
    } catch (error) {
      console.error('Registration error:', error);
      
      // Extract error message
      const errorMessage = error instanceof Error ? error.message : 'Failed to register team';
      setApiError(getErrorTitle(errorMessage));
      setErrorDetails(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 py-6">
          <a href="/" className="text-blue-600 font-bold text-xl">
            ← Back to Home
          </a>
        </nav>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-20">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Team Registration</h1>

          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-red-800">{apiError}</h3>
                  {errorDetails && (
                    <p className="mt-2 text-sm text-red-700">
                      {errorDetails}
                    </p>
                  )}
                  <p className="mt-3 text-sm text-red-600">
                    💡 <strong>Tip:</strong> Please check that all information is correct and try again. If the problem persists, contact us at forgeascend@gmail.com
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Team Name and Size - FIRST */}
            <fieldset className="border-b pb-6 bg-blue-50 p-4 rounded">
              <legend className="text-lg font-bold text-gray-900 mb-4">Step 1: Team Information</legend>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your team name"
                    {...register('teamName')}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.teamName && <p className="text-red-600 text-sm mt-1">{errors.teamName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Team Size <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    {(['1', '2', '3', '4'] as const).map((size) => {
                      const labels = { '1': 'Solo (1 Member)', '2': 'Duo (2 Members)', '3': 'Trio (3 Members)', '4': 'Squad (4 Members)' };
                      const cost = PRICING[size];
                      return (
                        <div key={size} className="flex items-center">
                          <input
                            type="radio"
                            id={`teamSize-${size}`}
                            value={size}
                            {...register('teamSize')}
                            onChange={(e) => setSelectedTeamSize(e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label htmlFor={`teamSize-${size}`} className="ml-3 flex items-center cursor-pointer">
                            <span className="text-sm font-medium text-gray-700">{labels[size]}</span>
                            <span className="ml-2 text-sm font-semibold text-blue-600">₹{cost}</span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                  {errors.teamSize && <p className="text-red-600 text-sm mt-2">{errors.teamSize.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    College / University Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your college/university name"
                    {...register('collegeName')}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.collegeName && <p className="text-red-600 text-sm mt-1">{errors.collegeName.message}</p>}
                </div>
              </div>
            </fieldset>

            {/* Step 2: Team Lead - NOW STEP 2 */}
            {selectedTeamSize && (
              <fieldset className="border-b pb-6 bg-purple-50 p-4 rounded">
                <legend className="text-lg font-bold text-gray-900 mb-4">Step 2: Team Leader</legend>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Team leader full name"
                      {...register('participant1Name')}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.participant1Name && (
                      <p className="text-red-600 text-sm mt-1">{errors.participant1Name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="teamleader@email.com"
                      {...register('participant1Email')}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.participant1Email && (
                      <p className="text-red-600 text-sm mt-1">{errors.participant1Email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="10-digit mobile number"
                      {...register('leaderPhone')}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.leaderPhone && <p className="text-red-600 text-sm mt-1">{errors.leaderPhone.message}</p>}
                  </div>
                </div>
              </fieldset>
            )}

            {/* Step 3: Additional Participants - THIRD */}
            {selectedTeamSize && parseInt(selectedTeamSize) > 1 && (
              <fieldset className="border-b pb-6 bg-yellow-50 p-4 rounded">
                <legend className="text-lg font-bold text-gray-900 mb-4">Step 3: Team Members</legend>

                <div className="space-y-6">
                  {/* Participant 2 */}
                  {parseInt(selectedTeamSize) >= 2 && (
                    <div className="space-y-4 pb-4 border-b">
                      <h3 className="font-semibold text-gray-900 text-base">Member 1 (Participant 2)</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          placeholder="Member name"
                          {...register('participant2Name')}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.participant2Name && (
                          <p className="text-red-600 text-sm mt-1">{errors.participant2Name.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                        <input
                          type="email"
                          placeholder="member@email.com"
                          {...register('participant2Email')}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.participant2Email && (
                          <p className="text-red-600 text-sm mt-1">{errors.participant2Email.message}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Participant 3 */}
                  {parseInt(selectedTeamSize) >= 3 && (
                    <div className="space-y-4 pb-4 border-b">
                      <h3 className="font-semibold text-gray-900 text-base">Member 2 (Participant 3)</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          placeholder="Member name"
                          {...register('participant3Name')}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.participant3Name && (
                          <p className="text-red-600 text-sm mt-1">{errors.participant3Name.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                        <input
                          type="email"
                          placeholder="member@email.com"
                          {...register('participant3Email')}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.participant3Email && (
                          <p className="text-red-600 text-sm mt-1">{errors.participant3Email.message}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Participant 4 */}
                  {parseInt(selectedTeamSize) >= 4 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 text-base">Member 3 (Participant 4)</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          placeholder="Member name"
                          {...register('participant4Name')}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.participant4Name && (
                          <p className="text-red-600 text-sm mt-1">{errors.participant4Name.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                        <input
                          type="email"
                          placeholder="member@email.com"
                          {...register('participant4Email')}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.participant4Email && (
                          <p className="text-red-600 text-sm mt-1">{errors.participant4Email.message}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </fieldset>
            )}

            {/* Step 4: Payment Section - FOURTH */}
            {selectedTeamSize && (
              <fieldset className="border-b pb-6 bg-red-50 p-4 rounded">
                <legend className="text-lg font-bold text-gray-900 mb-4">Step 4: Payment Information</legend>

                {/* Price Display */}
                <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Registration Fee:</span>
                    <span className="text-2xl font-bold text-green-600">₹{PRICING[selectedTeamSize as keyof typeof PRICING]}</span>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="mb-6 p-3 sm:p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Scan to Pay</h3>
                  <div className="flex flex-col items-center overflow-x-hidden">
                    <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md mb-4">
                      {/* UPI QR Code Image */}
                      <img 
                        src="/upi.jpg" 
                        alt="UPI QR Code" 
                        className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 object-cover rounded"
                      />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 text-center px-2">
                      Scan this QR code with your UPI app to complete the payment of ₹{PRICING[selectedTeamSize as keyof typeof PRICING]}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      UTR ID (Transaction Reference Number) <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      Enter the UTR after completing payment via the QR code
                    </p>
                    <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg flex justify-center">
                      <img 
                        src="/utr.jpg" 
                        alt="UTR ID Example" 
                        className="max-w-xs max-h-40 object-contain rounded"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="e.g., 123456789"
                      {...register('utrId')}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.utrId && <p className="text-red-600 text-sm mt-1">{errors.utrId.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Screenshot Google Drive Link <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Upload the screenshot to Google Drive, set access to "Anyone with link can view", and paste the link here
                    </p>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/..."
                      {...register('paymentScreenshot')}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.paymentScreenshot && (
                      <p className="text-red-600 text-sm mt-1">{errors.paymentScreenshot.message}</p>
                    )}
                  </div>
                </div>
              </fieldset>
            )}

            {/* Confirmation */}
            {selectedTeamSize && (
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...register('confirmation')}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">
                  <span className="text-red-500">*</span> I confirm that this registration is for my entire team, that
                  all members have a valid NOC, and that the UTR ID entered is correct.
                </label>
              </div>
            )}
            {errors.confirmation && <p className="text-red-600 text-sm mt-1">{errors.confirmation.message}</p>}

            {/* Submit */}
            {selectedTeamSize && (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isLoading ? 'Processing...' : 'Request to Join'}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
