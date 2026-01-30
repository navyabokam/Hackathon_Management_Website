import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Payment from './pages/Payment';
import Confirmation from './pages/Confirmation';
import Lookup from './pages/Lookup';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminTeamDetail from './pages/AdminTeamDetail';
import './index.css';
export default function App() {
    return (_jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Landing, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/payment", element: _jsx(Payment, {}) }), _jsx(Route, { path: "/confirmation", element: _jsx(Confirmation, {}) }), _jsx(Route, { path: "/lookup", element: _jsx(Lookup, {}) }), _jsx(Route, { path: "/admin/login", element: _jsx(AdminLogin, {}) }), _jsx(Route, { path: "/admin/dashboard", element: _jsx(AdminDashboard, {}) }), _jsx(Route, { path: "/admin/teams/:id", element: _jsx(AdminTeamDetail, {}) })] }) }));
}
