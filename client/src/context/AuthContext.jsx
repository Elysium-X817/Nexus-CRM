import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('crm_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const userData = await api.getMe();
        setUser(userData);
      } catch (err) {
        console.error('Failed to load user with token:', err.message);
        localStorage.removeItem('crm_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem('crm_token', data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  const register = async (name, email, password, companyName) => {
    const data = await api.register({ name, email, password, companyName });
    localStorage.setItem('crm_token', data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('crm_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const updated = await api.updateProfile(profileData);
    setUser((prev) => ({ ...prev, ...updated }));
    return updated;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
