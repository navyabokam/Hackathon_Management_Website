import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Payment from './pages/Payment';
import Confirmation from './pages/Confirmation';
import Lookup from './pages/Lookup';
import AdminDashboard from './pages/AdminDashboard';
import AdminTeamDetail from './pages/AdminTeamDetail';
import './index.css';

// Invalid access component for blocked routes
function InvalidAdminAccess(): React.ReactElement {
  const location = useLocation();
  const isOldAdminRoute = location.pathname.startsWith('/admin') && !location.pathname.includes('/admin/forgeascend-9XK');
  
  if (isOldAdminRoute) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 mb-6">Page not found.</p>
          <a href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
        <a href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
          ← Back to Home
        </a>
      </div>
    </div>
  );
}

export default function App(): React.ReactElement {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/lookup" element={<Lookup />} />
        
        {/* Valid admin routes with secret key - MUST come before catch-all */}
        <Route path="/admin/forgeascend-9XK/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/forgeascend-9XK/teams/:id" element={<AdminTeamDetail />} />
        
        {/* Block all other admin routes */}
        <Route path="/admin/*" element={<InvalidAdminAccess />} />
        
        {/* Catch all 404 */}
        <Route path="*" element={<InvalidAdminAccess />} />
      </Routes>
    </Router>
  );
}
