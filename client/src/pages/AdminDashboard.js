import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
export default function AdminDashboard() {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('teamName');
    const [isSearching, setIsSearching] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }
        loadTeams();
    }, [navigate]);
    const loadTeams = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await api.getAllTeams(50, 0);
            setTeams(result.teams);
        }
        catch (err) {
            setError('Failed to load teams');
            if (err?.response?.status === 401) {
                navigate('/admin/login');
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery) {
            loadTeams();
            return;
        }
        setIsSearching(true);
        try {
            const result = await api.searchTeams(searchType, searchQuery);
            setTeams(result.teams);
        }
        catch (err) {
            setError('Search failed');
        }
        finally {
            setIsSearching(false);
        }
    };
    const handleLogout = async () => {
        try {
            await api.logoutAdmin();
            localStorage.removeItem('authToken');
            navigate('/');
        }
        catch (err) {
            console.error('Logout failed:', err);
        }
    };
    const handleDownloadExcel = async () => {
        try {
            const blob = await api.exportTeamsToExcel();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `teams_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
        catch (err) {
            setError('Failed to download Excel file');
            console.error('Download error:', err);
        }
    };
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
    const getVerificationBadge = (status) => {
        if (status === 'Verified') {
            return _jsx("span", { className: "px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-semibold", children: "\u2713 Verified" });
        }
        return _jsx("span", { className: "px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm", children: "Not Verified" });
    };
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "mb-4 text-lg", children: "Loading dashboard..." }), _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-100", children: [_jsx("header", { className: "bg-white shadow", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-6 flex justify-between items-center", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Admin Dashboard" }), _jsx("button", { onClick: handleLogout, className: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700", children: "Logout" })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [error && (_jsx("div", { className: "mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded", children: error })), _jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "font-bold text-lg text-gray-900", children: "Search Teams" }), _jsx("button", { onClick: handleDownloadExcel, className: "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold text-sm", children: "\u2B07\uFE0F Download Excel" })] }), _jsxs("form", { onSubmit: handleSearch, className: "flex gap-2", children: [_jsxs("select", { value: searchType, onChange: (e) => setSearchType(e.target.value), className: "px-4 py-2 border border-gray-300 rounded", children: [_jsx("option", { value: "teamName", children: "Team Name" }), _jsx("option", { value: "collegeName", children: "College Name" }), _jsx("option", { value: "registrationId", children: "Registration ID" })] }), _jsx("input", { type: "text", placeholder: "Search...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "flex-1 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" }), _jsx("button", { type: "submit", disabled: isSearching, className: "px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400", children: isSearching ? 'Searching...' : 'Search' }), _jsx("button", { type: "button", onClick: loadTeams, className: "px-6 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50", children: "Reset" })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-900", children: "Registration ID" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-900", children: "Team Name" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-900", children: "College" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-900", children: "Size" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-900", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-900", children: "Payment" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-900", children: "Verification" }), _jsx("th", { className: "px-6 py-3 text-left text-sm font-semibold text-gray-900", children: "Action" })] }) }), _jsx("tbody", { className: "divide-y", children: teams.map((team) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 text-sm font-mono text-blue-600", children: team.registrationId }), _jsx("td", { className: "px-6 py-4 text-sm font-semibold text-gray-900", children: team.teamName }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: team.collegeName }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: team.teamSize }), _jsx("td", { className: "px-6 py-4", children: getStatusBadge(team.status) }), _jsx("td", { className: "px-6 py-4", children: getPaymentBadge(team.paymentStatus) }), _jsx("td", { className: "px-6 py-4", children: getVerificationBadge(team.verificationStatus) }), _jsx("td", { className: "px-6 py-4", children: _jsx("a", { href: `/admin/teams/${team._id}`, className: "text-blue-600 hover:text-blue-700 font-semibold text-sm", children: "View" }) })] }, team._id))) })] }) }), teams.length === 0 && (_jsxs("div", { className: "p-6 text-center text-gray-600", children: ["No teams found.", ' ', searchQuery && (_jsxs(_Fragment, { children: ["Try a different search or", ' ', _jsx("button", { onClick: loadTeams, className: "text-blue-600 hover:text-blue-700", children: "load all teams" })] }))] }))] })] })] }));
}
