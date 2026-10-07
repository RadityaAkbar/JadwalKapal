import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ship, Shield, LogOut, LayoutDashboard, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { admin, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 32px',
      background: 'rgba(10, 20, 36, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Brand */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(2, 132, 199, 0.4)'
        }}>
          <Ship size={24} color="#ffffff" />
        </div>
        <div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc' }}>
            Jadwal<span style={{ color: '#38bdf8' }}>Kapal</span>
          </span>
          <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0, lineHeight: 1 }}>
            Informasi Pelayaran & Penyeberangan
          </p>
        </div>
      </Link>

      {/* Center: Live Clock */}
      <div style={{
        display: 'none',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        borderRadius: '9999px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        fontSize: '0.85rem',
        color: '#cbd5e1'
      }} className="nav-clock">
        <Clock size={15} color="#38bdf8" />
        <span>{time.toLocaleTimeString('id-ID')} WIB</span>
      </div>

      {/* Navigation actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <Link to="/" style={{
          fontSize: '0.9rem',
          fontWeight: 600,
          color: '#cbd5e1',
          padding: '8px 12px',
          borderRadius: '8px',
          transition: 'all 0.2s'
        }}>
          Jadwal Publik
        </Link>

        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link to="/admin" className="btn btn-primary btn-sm">
              <LayoutDashboard size={16} />
              <span>Dashboard Admin</span>
            </Link>
            <button 
              onClick={handleLogout} 
              className="btn btn-secondary btn-sm"
              title="Keluar dari akun admin"
            >
              <LogOut size={15} />
              <span>Keluar ({admin?.username || 'Admin'})</span>
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-secondary btn-sm">
            <Shield size={16} color="#38bdf8" />
            <span>Login Admin</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
