import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { generateTransactionRef } from '../utils/id-generator';
export default function Payment() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
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
            }
            catch (err) {
                setError('Failed to load payment information');
            }
            finally {
                setIsLoading(false);
            }
        };
        loadPayment();
    }, [registrationId]);
    const handlePaymentSuccess = async () => {
        if (!registrationId)
            return;
        try {
            const transactionRef = generateTransactionRef();
            await api.confirmPayment(registrationId, transactionRef);
            // Navigate to confirmation page
            navigate(`/confirmation?registrationId=${registrationId}`);
        }
        catch (err) {
            setError('Payment confirmation failed');
        }
    };
    const handlePaymentFail = async () => {
        if (!registrationId)
            return;
        try {
            await api.failPayment(registrationId);
            setError('Payment failed. Please try again.');
            // Optionally redirect after a delay
            setTimeout(() => {
                navigate('/register');
            }, 3000);
        }
        catch (err) {
            setError('Error processing failed payment');
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "mb-4 text-lg", children: "Loading payment details..." }), _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-b from-blue-50 to-blue-100", children: [_jsx("header", { className: "bg-white shadow", children: _jsx("nav", { className: "max-w-7xl mx-auto px-4 py-6", children: _jsx("a", { href: "/", className: "text-blue-600 font-bold text-xl", children: "\u2190 Back to Home" }) }) }), _jsx("div", { className: "max-w-2xl mx-auto px-4 py-20", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Payment" }), error && (_jsx("div", { className: "mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded", children: error })), paymentInfo && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "p-4 bg-gray-50 rounded border border-gray-200", children: [_jsx("h2", { className: "font-semibold text-lg mb-4", children: "Order Summary" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-700", children: "Team Name:" }), _jsx("span", { className: "font-semibold", children: paymentInfo.teamName })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-700", children: "Registration ID:" }), _jsx("span", { className: "font-semibold", children: paymentInfo.registrationId })] }), _jsxs("div", { className: "flex justify-between border-t pt-3 mt-3", children: [_jsx("span", { className: "text-gray-700 font-semibold", children: "Amount:" }), _jsxs("span", { className: "text-2xl font-bold text-blue-600", children: ["\u20B9", paymentInfo.amount, " ", paymentInfo.currency] })] })] })] }), _jsx("div", { className: "bg-blue-50 border border-blue-200 rounded p-4 mb-6", children: _jsxs("p", { className: "text-sm text-blue-800", children: [_jsx("strong", { children: "Mock Payment Gateway:" }), " This is a test environment. Use the buttons below to simulate payment success or failure."] }) }), _jsxs("div", { className: "space-y-3", children: [_jsx("button", { onClick: handlePaymentSuccess, className: "w-full px-6 py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700", children: "\u2713 Simulate Payment Success" }), _jsx("button", { onClick: handlePaymentFail, className: "w-full px-6 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700", children: "\u2717 Simulate Payment Failed" }), _jsx("button", { onClick: () => navigate('/register'), className: "w-full px-6 py-3 text-gray-700 border border-gray-300 rounded hover:bg-gray-50", children: "\u2190 Go Back to Registration" })] }), _jsx("div", { className: "p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800", children: _jsxs("p", { children: [_jsx("strong", { children: "Note:" }), " In production, this would redirect to an actual payment gateway (Razorpay, Stripe, etc.)."] }) })] }))] }) })] }));
}
