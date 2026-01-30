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
  const registrationId = searchParams.get('registrationId');

  useEffect(() => {
    const loadPayment = async () => {
      if (!registrationId) {
        setError('No registration ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const payment = await api.initiatePayment(registrationId);
        setPaymentInfo(payment);
      } catch (err) {
        setError('Failed to load payment information');
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
      setError('Payment confirmation failed');
    }
  };

  const handlePaymentFail = async () => {
    if (!registrationId) return;

    try {
      await api.failPayment(registrationId);
      setError('Payment failed. Please try again.');
      // Optionally redirect after a delay
      setTimeout(() => {
        navigate('/register');
      }, 3000);
    } catch (err) {
      setError('Error processing failed payment');
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
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
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
