import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Set default auth header untuk Axios jika token ada
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verifikasi token ke backend
      axios.get('http://localhost:5000/api/auth/me')
        .then(res => {
          setAdmin(res.data.admin);
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setAdmin(null);
      setLoading(false);
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      const { token: receivedToken, admin: adminData } = res.data;
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setAdmin(adminData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Login gagal, periksa kembali koneksi atau data login.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setAdmin(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, loading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
