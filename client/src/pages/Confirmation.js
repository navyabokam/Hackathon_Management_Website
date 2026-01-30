import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
export default function Confirmation() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [team, setTeam] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
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
            }
            catch (err) {
                console.error('Error loading team:', err);
                setError(`Failed to load registration details: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
            finally {
                setIsLoading(false);
            }
        };
        loadTeam();
    }, [registrationId]);
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "mb-4 text-lg", children: "Loading confirmation..." }), _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" })] }) }));
    }
    if (error) {
        return (_jsxs("div", { className: "min-h-screen bg-gradient-to-b from-red-50 to-red-100", children: [_jsx("header", { className: "bg-white shadow", children: _jsx("nav", { className: "max-w-7xl mx-auto px-4 py-6", children: _jsx("a", { href: "/", className: "text-blue-600 font-bold text-xl", children: "\u2190 Back to Home" }) }) }), _jsx("div", { className: "max-w-2xl mx-auto px-4 py-20", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8 text-center", children: [_jsx("div", { className: "text-6xl mb-6", children: "\u274C" }), _jsx("h1", { className: "text-3xl font-bold text-red-600 mb-4", children: "Confirmation Failed" }), _jsx("p", { className: "text-gray-700 mb-6", children: error }), _jsx("button", { onClick: () => navigate('/register'), className: "px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700", children: "Try Again" })] }) })] }));
    }
    if (!team) {
        return (_jsxs("div", { className: "min-h-screen bg-gradient-to-b from-red-50 to-red-100", children: [_jsx("header", { className: "bg-white shadow", children: _jsx("nav", { className: "max-w-7xl mx-auto px-4 py-6", children: _jsx("a", { href: "/", className: "text-blue-600 font-bold text-xl", children: "\u2190 Back to Home" }) }) }), _jsx("div", { className: "max-w-2xl mx-auto px-4 py-20", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8 text-center", children: [_jsx("div", { className: "text-6xl mb-4", children: "\u26A0\uFE0F" }), _jsx("h2", { className: "text-2xl font-bold text-red-600 mb-4", children: "Team Not Found" }), _jsx("p", { className: "text-gray-700 mb-6", children: "Unable to load team information. The registration ID may be invalid or the team data may not exist." }), _jsxs("p", { className: "text-sm text-gray-600 mb-6", children: ["Registration ID: ", _jsx("code", { className: "bg-gray-100 px-2 py-1 rounded", children: registrationId })] }), _jsx("button", { onClick: () => navigate('/register'), className: "px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700", children: "Go Back to Registration" })] }) })] }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-b from-green-50 to-green-100", children: [_jsx("header", { className: "bg-white shadow", children: _jsx("nav", { className: "max-w-7xl mx-auto px-4 py-6", children: _jsx("a", { href: "/", className: "text-blue-600 font-bold text-xl", children: "\u2190 Back to Home" }) }) }), _jsx("div", { className: "max-w-2xl mx-auto px-4 py-20", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "text-7xl mb-4", children: "\u2705" }), _jsx("h1", { className: "text-4xl font-bold text-green-600 mb-2", children: "Registration Confirmed!" }), _jsx("p", { className: "text-gray-600", children: "Thank you for registering for the College Hackathon." })] }), _jsxs("div", { className: "bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg mb-8 border border-blue-200", children: [_jsx("h2", { className: "font-semibold text-gray-900 text-center mb-3", children: "Your Registration ID" }), _jsx("div", { className: "text-center", children: _jsx("div", { className: "inline-block bg-white px-6 py-3 rounded border-2 border-blue-600", children: _jsx("p", { className: "text-3xl font-bold text-blue-600 font-mono", children: team.registrationId }) }) }), _jsx("p", { className: "text-sm text-gray-600 text-center mt-3", children: "Keep this ID safe. You'll need it to verify your team on the day of the hackathon." })] }), _jsxs("div", { className: "bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8", children: [_jsx("h2", { className: "font-bold text-lg text-gray-900 mb-4", children: "Team Details" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-700", children: "Team Name:" }), _jsx("span", { className: "font-semibold", children: team.teamName })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-700", children: "College:" }), _jsx("span", { className: "font-semibold", children: team.collegeName })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-700", children: "Team Members:" }), _jsx("span", { className: "font-semibold", children: team.teamSize })] }), _jsxs("div", { className: "border-t pt-3", children: [_jsx("span", { className: "text-gray-700", children: "Members:" }), _jsx("ul", { className: "mt-2 ml-4 space-y-1", children: team.participants.map((p, i) => (_jsxs("li", { className: "text-sm text-gray-600", children: ["\u2022 ", p.fullName, " (", p.email, ")"] }, i))) })] })] })] }), _jsx("div", { className: "bg-blue-50 border border-blue-200 rounded p-4 mb-6", children: _jsxs("p", { className: "text-sm text-blue-800", children: [_jsx("strong", { children: "Email Confirmation:" }), " A confirmation email with all the details has been sent to your team leader's email address."] }) }), _jsxs("div", { className: "space-y-3", children: [_jsx("a", { href: "/lookup", className: "block px-6 py-3 bg-blue-600 text-white text-center font-semibold rounded hover:bg-blue-700", children: "View Registration Status" }), _jsx("a", { href: "/", className: "block px-6 py-3 text-gray-700 border border-gray-300 text-center rounded hover:bg-gray-50", children: "Back to Home" })] }), _jsx("div", { className: "mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800", children: _jsxs("p", { children: [_jsx("strong", { children: "Next Steps:" }), " Make sure all team members arrive on time on the day of the hackathon. Bring a valid ID and be ready to verify using your Registration ID."] }) })] }) })] }));
}
