import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('healthguard_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('healthguard_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('healthguard_token'));
  const [loading, setLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('healthguard_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.data.success) {
            setUser(res.data.user);
            setProfile(res.data.profile);
            localStorage.setItem('healthguard_user', JSON.stringify(res.data.user));
            if (res.data.profile) {
              localStorage.setItem('healthguard_profile', JSON.stringify(res.data.profile));
            }
          }
        } catch (err) {
          console.warn('Session verification failed, logging out:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      setProfile(res.data.profile);
      localStorage.setItem('healthguard_token', res.data.token);
      localStorage.setItem('healthguard_user', JSON.stringify(res.data.user));
      if (res.data.profile) {
        localStorage.setItem('healthguard_profile', JSON.stringify(res.data.profile));
      }
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await authService.register(formData);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      setProfile(res.data.profile);
      localStorage.setItem('healthguard_token', res.data.token);
      localStorage.setItem('healthguard_user', JSON.stringify(res.data.user));
      if (res.data.profile) {
        localStorage.setItem('healthguard_profile', JSON.stringify(res.data.profile));
      }
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setProfile(null);
    localStorage.removeItem('healthguard_token');
    localStorage.removeItem('healthguard_user');
    localStorage.removeItem('healthguard_profile');
  };

  const demoLogin = async (role = 'patient') => {
    const credentials =
      role === 'doctor'
        ? { email: 'doctor@example.com', password: 'Password123!' }
        : { email: 'patient@example.com', password: 'Password123!' };
    return await login(credentials.email, credentials.password);
  };

  const updateCachedProfile = (newProfile, newUser) => {
    if (newProfile) {
      setProfile(newProfile);
      localStorage.setItem('healthguard_profile', JSON.stringify(newProfile));
    }
    if (newUser) {
      setUser(newUser);
      localStorage.setItem('healthguard_user', JSON.stringify(newUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isPatient: user?.role === 'patient',
        isDoctor: user?.role === 'doctor',
        login,
        register,
        logout,
        demoLogin,
        updateCachedProfile,
      }}
    >
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
