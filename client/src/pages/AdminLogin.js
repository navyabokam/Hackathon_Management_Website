import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '../schemas/index';
import * as api from '../services/api';
export default function AdminLogin() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(LoginSchema),
    });
    const onSubmit = async (data) => {
        setError(null);
        setIsLoading(true);
        try {
            const result = await api.loginAdmin(data.email, data.password);
            // Store token and redirect
            localStorage.setItem('authToken', result.token);
            navigate('/admin/dashboard');
        }
        catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
            else {
                setError('Login failed. Please check your credentials.');
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center", children: _jsxs("div", { className: "max-w-md w-full bg-white rounded-lg shadow-lg p-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2 text-center", children: "Admin Login" }), _jsx("p", { className: "text-gray-600 text-center mb-8", children: "Sign in to manage hackathon registrations" }), error && (_jsx("div", { className: "mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded", children: error })), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { type: "email", placeholder: "admin@hackathon.local", ...register('email'), className: "w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" }), errors.email && _jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.email.message })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Password" }), _jsx("input", { type: "password", placeholder: "Enter your password", ...register('password'), className: "w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" }), errors.password && _jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.password.message })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:bg-gray-400 mt-6", children: isLoading ? 'Signing in...' : 'Sign In' })] }), _jsx("div", { className: "mt-8 p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800", children: _jsxs("p", { children: [_jsx("strong", { children: "Demo Credentials:" }), _jsx("br", {}), "Email: admin@hackathon.local", _jsx("br", {}), "Password: Admin@123"] }) }), _jsx("div", { className: "mt-6 text-center", children: _jsx("a", { href: "/", className: "text-blue-600 hover:text-blue-700", children: "\u2190 Back to Home" }) })] }) }));
}
