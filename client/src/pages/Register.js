import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { RegisterTeamSchema } from '../schemas/index';
import * as api from '../services/api';
export default function Register() {
    const [apiError, setApiError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { register, control, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(RegisterTeamSchema),
        defaultValues: {
            participants: [{ fullName: '', email: '', phone: '', rollNumber: '' }],
        },
    });
    const { fields, append } = useFieldArray({
        control,
        name: 'participants',
    });
    const onSubmit = async (data) => {
        setApiError(null);
        setIsLoading(true);
        try {
            const result = await api.createTeam(data);
            // Navigate to payment page with registration ID
            navigate(`/payment?registrationId=${result.registrationId}`);
        }
        catch (error) {
            if (error instanceof Error) {
                setApiError(error.message);
            }
            else {
                setApiError('Failed to register team');
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-b from-blue-50 to-blue-100", children: [_jsx("header", { className: "bg-white shadow", children: _jsx("nav", { className: "max-w-7xl mx-auto px-4 py-6", children: _jsx("a", { href: "/", className: "text-blue-600 font-bold text-xl", children: "\u2190 Back to Home" }) }) }), _jsx("div", { className: "max-w-2xl mx-auto px-4 py-20", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-6", children: "Team Registration" }), apiError && (_jsx("div", { className: "mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded", children: apiError })), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [_jsxs("fieldset", { className: "border-b pb-6", children: [_jsx("legend", { className: "text-lg font-bold text-gray-900 mb-4", children: "Team Information" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Team Name" }), _jsx("input", { type: "text", placeholder: "e.g., CodeMasters", ...register('teamName'), className: "w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" }), errors.teamName && _jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.teamName.message })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "College Name" }), _jsx("input", { type: "text", placeholder: "e.g., XYZ University", ...register('collegeName'), className: "w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" }), errors.collegeName && _jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.collegeName.message })] })] })] }), _jsxs("fieldset", { className: "border-b pb-6", children: [_jsx("legend", { className: "text-lg font-bold text-gray-900 mb-4", children: "Team Leader" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { type: "email", placeholder: "leader@example.com", ...register('leaderEmail'), className: "w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" }), errors.leaderEmail && _jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.leaderEmail.message })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Phone" }), _jsx("input", { type: "text", placeholder: "1234567890", ...register('leaderPhone'), className: "w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" }), errors.leaderPhone && _jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.leaderPhone.message })] })] })] }), _jsxs("fieldset", { className: "pb-6", children: [_jsxs("legend", { className: "text-lg font-bold text-gray-900 mb-4", children: ["Team Members (", fields.length, "/4)"] }), _jsx("div", { className: "space-y-6", children: fields.map((field, index) => (_jsxs("div", { className: "p-4 border border-gray-200 rounded bg-gray-50", children: [_jsxs("h3", { className: "font-semibold text-gray-900 mb-3", children: ["Member ", index + 1] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Full Name" }), _jsx("input", { type: "text", placeholder: "John Doe", ...register(`participants.${index}.fullName`), className: "w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" }), errors.participants?.[index]?.fullName && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.participants[index]?.fullName?.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { type: "email", placeholder: "john@example.com", ...register(`participants.${index}.email`), className: "w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" }), errors.participants?.[index]?.email && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.participants[index]?.email?.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Phone" }), _jsx("input", { type: "text", placeholder: "1234567890", ...register(`participants.${index}.phone`), className: "w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" }), errors.participants?.[index]?.phone && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.participants[index]?.phone?.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Roll Number" }), _jsx("input", { type: "text", placeholder: "CSE-001", ...register(`participants.${index}.rollNumber`), className: "w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" }), errors.participants?.[index]?.rollNumber && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.participants[index]?.rollNumber?.message }))] })] })] }, field.id))) }), fields.length < 4 && (_jsx("button", { type: "button", onClick: () => append({ fullName: '', email: '', phone: '', rollNumber: '' }), className: "mt-4 px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50", children: "+ Add Another Member" })), errors.participants && typeof errors.participants.message === 'string' && (_jsx("p", { className: "text-red-600 text-sm mt-2", children: errors.participants.message }))] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:bg-gray-400", children: isLoading ? 'Processing...' : 'Proceed to Payment' })] })] }) })] }));
}
