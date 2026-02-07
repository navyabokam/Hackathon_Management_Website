import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { generateTransactionRef } from '../utils/id-generator';

export default function Payment(): React.ReactElement {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const registrationId = searchParams.get('registrationId');

  useEffect(() => {
    const loadPayment = async () => {
      if (!registrationId) {
        setError('Invalid Request');
        setErrorDetails('No registration ID provided. Please start a new registration.');
        setIsLoading(false);
        return;
      }

      try {
        const payment = await api.initiatePayment(registrationId);
        setPaymentInfo(payment);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load payment information';
        setError('Payment Setup Error');
        setErrorDetails(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    loadPayment();
  }, [registrationId]);

  const handlePaymentSuccess = async () => {
    if (!registrationId) return;

    try {
      const transactionRef = generateTransactionRef();
      await api.confirmPayment(registrationId, transactionRef);
      // Navigate to confirmation page
      navigate(`/confirmation?registrationId=${registrationId}`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Payment confirmation failed';
      setError('Payment Confirmation Error');
      setErrorDetails(errorMsg);
    }
  };

  const handlePaymentFail = async () => {
    if (!registrationId) return;

    try {
      await api.failPayment(registrationId);
      setError('Payment Failed');
      setErrorDetails('Your payment was not successful. Redirecting to registration...');
      // Optionally redirect after a delay
      setTimeout(() => {
        navigate('/register');
      }, 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error processing failed payment';
      setError('Error');
      setErrorDetails(errorMsg);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg">Loading payment details...</div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Payment</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-red-800">{error}</h3>
                  {errorDetails && (
                    <p className="mt-2 text-sm text-red-700">
                      {errorDetails}
                    </p>
                  )}
                  <p className="mt-3 text-sm text-red-600">
                    💡 <strong>Tip:</strong> If the problem persists, contact support at forgeascend@gmail.com or call 6300458303
                  </p>
                </div>
              </div>
            </div>
          )}

          {paymentInfo && (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded border border-gray-200">
                <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Team Name:</span>
                    <span className="font-semibold">{paymentInfo.teamName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Registration ID:</span>
                    <span className="font-semibold">{paymentInfo.registrationId}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3 mt-3">
                    <span className="text-gray-700 font-semibold">Amount:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{paymentInfo.amount} {paymentInfo.currency}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Mock Payment Gateway:</strong> This is a test environment. Use the buttons below to
                  simulate payment success or failure.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handlePaymentSuccess}
                  className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
                >
                  ✓ Simulate Payment Success
                </button>
                <button
                  onClick={handlePaymentFail}
                  className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700"
                >
                  ✗ Simulate Payment Failed
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="w-full px-6 py-3 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                >
                  ← Go Back to Registration
                </button>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                <p>
                  <strong>Note:</strong> In production, this would redirect to an actual payment gateway (Razorpay,
                  Stripe, etc.).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
