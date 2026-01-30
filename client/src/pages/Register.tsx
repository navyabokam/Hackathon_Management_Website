import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { RegisterTeamSchema, type RegisterTeamInput } from '../schemas/index';
import * as api from '../services/api';

export default function Register(): React.ReactElement {
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterTeamInput>({
    resolver: zodResolver(RegisterTeamSchema),
    defaultValues: {
      participants: [{ fullName: '', email: '', phone: '', rollNumber: '' }],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: 'participants',
  });

  const onSubmit = async (data: RegisterTeamInput) => {
    setApiError(null);
    setIsLoading(true);
    try {
      const result = await api.createTeam(data);
      // Navigate to payment page with registration ID
      navigate(`/payment?registrationId=${result.registrationId}`);
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('Failed to register team');
      }
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
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Team Info */}
            <fieldset className="border-b pb-6">
              <legend className="text-lg font-bold text-gray-900 mb-4">Team Information</legend>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                  <input
                    type="text"
                    placeholder="e.g., CodeMasters"
                    {...register('teamName')}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.teamName && <p className="text-red-600 text-sm mt-1">{errors.teamName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">College Name</label>
                  <input
                    type="text"
                    placeholder="e.g., XYZ University"
                    {...register('collegeName')}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.collegeName && <p className="text-red-600 text-sm mt-1">{errors.collegeName.message}</p>}
                </div>
              </div>
            </fieldset>

            {/* Team Leader */}
            <fieldset className="border-b pb-6">
              <legend className="text-lg font-bold text-gray-900 mb-4">Team Leader</legend>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="leader@example.com"
                    {...register('leaderEmail')}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.leaderEmail && <p className="text-red-600 text-sm mt-1">{errors.leaderEmail.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="1234567890"
                    {...register('leaderPhone')}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.leaderPhone && <p className="text-red-600 text-sm mt-1">{errors.leaderPhone.message}</p>}
                </div>
              </div>
            </fieldset>

            {/* Participants */}
            <fieldset className="pb-6">
              <legend className="text-lg font-bold text-gray-900 mb-4">
                Team Members ({fields.length}/4)
              </legend>

              <div className="space-y-6">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border border-gray-200 rounded bg-gray-50">
                    <h3 className="font-semibold text-gray-900 mb-3">Member {index + 1}</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          {...register(`participants.${index}.fullName`)}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.participants?.[index]?.fullName && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.participants[index]?.fullName?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          placeholder="john@example.com"
                          {...register(`participants.${index}.email`)}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.participants?.[index]?.email && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.participants[index]?.email?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="text"
                          placeholder="1234567890"
                          {...register(`participants.${index}.phone`)}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.participants?.[index]?.phone && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.participants[index]?.phone?.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                        <input
                          type="text"
                          placeholder="CSE-001"
                          {...register(`participants.${index}.rollNumber`)}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.participants?.[index]?.rollNumber && (
                          <p className="text-red-600 text-sm mt-1">
                            {errors.participants[index]?.rollNumber?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {fields.length < 4 && (
                <button
                  type="button"
                  onClick={() => append({ fullName: '', email: '', phone: '', rollNumber: '' })}
                  className="mt-4 px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                >
                  + Add Another Member
                </button>
              )}

              {errors.participants && typeof errors.participants.message === 'string' && (
                <p className="text-red-600 text-sm mt-2">{errors.participants.message}</p>
              )}
            </fieldset>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
