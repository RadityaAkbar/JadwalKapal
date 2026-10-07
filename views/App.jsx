import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PublicSchedule from './pages/PublicSchedule';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Routes>
              {/* Halaman Publik untuk Pelanggan (Tidak perlu login) */}
              <Route path="/" element={<PublicSchedule />} />
              
              {/* Halaman Login Khusus Admin */}
              <Route path="/login" element={<AdminLogin />} />
              
              {/* Halaman Dashboard Khusus Admin setelah login */}
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Redirect fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
