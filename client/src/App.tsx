import React from 'react';
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

export default function App(): React.ReactElement {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/lookup" element={<Lookup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/teams/:id" element={<AdminTeamDetail />} />
      </Routes>
    </Router>
  );
}
