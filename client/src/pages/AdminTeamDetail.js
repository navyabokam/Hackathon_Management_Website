import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
export default function AdminTeamDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [team, setTeam] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isVerifying, setIsVerifying] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }
        loadTeam();
    }, [id, navigate]);
    const loadTeam = async () => {
        if (!id)
            return;
        setIsLoading(true);
        setError(null);
        try {
            const teamData = await api.getTeamDetail(id);
            setTeam(teamData);
        }
        catch (err) {
            setError('Failed to load team details');
            if (err?.response?.status === 401) {
                navigate('/admin/login');
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleToggleVerification = async () => {
        if (!id)
            return;
        setIsVerifying(true);
        setError(null);
        try {
            const result = await api.toggleTeamVerification(id);
            setTeam((prev) => prev
                ? {
                    ...prev,
                    verificationStatus: result.verificationStatus,
                }
                : null);
        }
        catch (err) {
            setError('Failed to update verification status');
        }
        finally {
            setIsVerifying(false);
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "mb-4 text-lg", children: "Loading team details..." }), _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" })] }) }));
    }
    if (error || !team) {
        return (_jsxs("div", { className: "min-h-screen bg-gray-100", children: [_jsx("header", { className: "bg-white shadow", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 py-6", children: _jsx("a", { href: "/admin/dashboard", className: "text-blue-600 font-bold text-lg", children: "\u2190 Back to Dashboard" }) }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 py-8", children: _jsxs("div", { className: "bg-white rounded-lg shadow p-6 text-center", children: [_jsx("p", { className: "text-red-600 font-semibold mb-4", children: error || 'Team not found' }), _jsx("a", { href: "/admin/dashboard", className: "text-blue-600 hover:text-blue-700", children: "Back to Dashboard" })] }) })] }));
    }
    const getStatusBadge = (status) => {
        switch (status) {
            case 'CONFIRMED':
                return _jsx("span", { className: "px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold", children: "\u2713 Confirmed" });
            case 'PENDING_PAYMENT':
                return _jsx("span", { className: "px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold", children: "\u23F3 Pending" });
            case 'CANCELLED':
                return _jsx("span", { className: "px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold", children: "\u2717 Cancelled" });
            default:
                return null;
        }
    };
    const getPaymentBadge = (status) => {
        switch (status) {
            case 'Success':
                return _jsx("span", { className: "px-3 py-1 bg-green-100 text-green-800 rounded text-sm", children: "Success" });
            case 'Failed':
                return _jsx("span", { className: "px-3 py-1 bg-red-100 text-red-800 rounded text-sm", children: "Failed" });
            case 'Pending':
                return _jsx("span", { className: "px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm", children: "Pending" });
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-100", children: [_jsx("header", { className: "bg-white shadow", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 py-6", children: _jsx("a", { href: "/admin/dashboard", className: "text-blue-600 font-bold text-lg", children: "\u2190 Back to Dashboard" }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [error && (_jsx("div", { className: "mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded", children: error })), _jsxs("div", { className: "bg-white rounded-lg shadow p-8 mb-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Team Details" }), _jsxs("div", { className: "grid grid-cols-2 gap-6 mb-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "font-semibold text-gray-900 text-lg mb-3", children: "Registration ID" }), _jsx("p", { className: "text-2xl font-mono text-blue-600", children: team.registrationId })] }), _jsxs("div", { children: [_jsx("h2", { className: "font-semibold text-gray-900 text-lg mb-3", children: "Team Name" }), _jsx("p", { className: "text-xl text-gray-900", children: team.teamName })] }), _jsxs("div", { children: [_jsx("h2", { className: "font-semibold text-gray-900 text-lg mb-3", children: "College" }), _jsx("p", { className: "text-gray-700", children: team.collegeName })] }), _jsxs("div", { children: [_jsx("h2", { className: "font-semibold text-gray-900 text-lg mb-3", children: "Team Size" }), _jsxs("p", { className: "text-gray-700", children: [team.teamSize, " members"] })] }), _jsxs("div", { children: [_jsx("h2", { className: "font-semibold text-gray-900 text-lg mb-3", children: "Registration Status" }), getStatusBadge(team.status)] }), _jsxs("div", { children: [_jsx("h2", { className: "font-semibold text-gray-900 text-lg mb-3", children: "Payment Status" }), getPaymentBadge(team.paymentStatus)] })] }), _jsx("div", { className: "border-t pt-6 mb-6", children: _jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "font-bold text-lg text-gray-900", children: "Verification Status" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "text-lg font-semibold", children: team.verificationStatus === 'Verified' ? (_jsx("span", { className: "text-green-600", children: "\u2713 Verified" })) : (_jsx("span", { className: "text-gray-600", children: "Not Verified" })) }), _jsx("button", { onClick: handleToggleVerification, disabled: isVerifying, className: `px-6 py-2 rounded text-white font-semibold ${team.verificationStatus === 'Verified'
                                                        ? 'bg-red-600 hover:bg-red-700'
                                                        : 'bg-green-600 hover:bg-green-700'} disabled:bg-gray-400`, children: isVerifying
                                                        ? 'Updating...'
                                                        : team.verificationStatus === 'Verified'
                                                            ? 'Unverify'
                                                            : 'Mark Verified' })] })] }) }), _jsxs("div", { className: "border-t pt-6 mb-6", children: [_jsx("h2", { className: "font-bold text-lg text-gray-900 mb-3", children: "Team Leader" }), _jsxs("div", { className: "bg-gray-50 p-4 rounded", children: [_jsxs("p", { className: "text-gray-700", children: [_jsx("span", { className: "font-semibold", children: "Email:" }), " ", team.leaderEmail] }), _jsxs("p", { className: "text-gray-700", children: [_jsx("span", { className: "font-semibold", children: "Phone:" }), " ", team.leaderPhone] })] })] }), _jsxs("div", { className: "border-t pt-6", children: [_jsx("h2", { className: "font-bold text-lg text-gray-900 mb-4", children: "Team Members" }), _jsx("div", { className: "space-y-4", children: team.participants.map((participant, index) => (_jsxs("div", { className: "bg-gray-50 p-4 rounded border border-gray-200", children: [_jsxs("h3", { className: "font-semibold text-gray-900 mb-2", children: ["Member ", index + 1] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("p", { children: [_jsx("span", { className: "font-semibold", children: "Name:" }), " ", participant.fullName] }), _jsxs("p", { children: [_jsx("span", { className: "font-semibold", children: "Email:" }), " ", participant.email] }), _jsxs("p", { children: [_jsx("span", { className: "font-semibold", children: "Phone:" }), " ", participant.phone] }), _jsxs("p", { children: [_jsx("span", { className: "font-semibold", children: "Roll Number:" }), " ", participant.rollNumber] })] })] }, index))) })] })] })] })] }));
}
