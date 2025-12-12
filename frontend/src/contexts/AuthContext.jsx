import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedAuth = localStorage.getItem('lawgpt_auth');
        const storedUser = localStorage.getItem('lawgpt_user');
        
        if (storedAuth === 'true' && storedUser) {
          setIsAuthenticated(true);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('lawgpt_auth');
        localStorage.removeItem('lawgpt_user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      // For now, we'll use a simple authentication
      // In production, this should call your backend API
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Try to authenticate with backend if endpoint exists
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUser({ username, ...data });
          localStorage.setItem('lawgpt_auth', 'true');
          localStorage.setItem('lawgpt_user', JSON.stringify({ username, ...data }));
          return;
        }
      } catch (apiError) {
        // If auth endpoint doesn't exist, fall back to demo mode
        console.log('Auth endpoint not available, using demo mode');
      }

      // Demo mode: Accept any credentials (for development)
      // In production, remove this and require proper backend authentication
      if (username && password) {
        setIsAuthenticated(true);
        setUser({ username, role: 'user' });
        localStorage.setItem('lawgpt_auth', 'true');
        localStorage.setItem('lawgpt_user', JSON.stringify({ username, role: 'user' }));
      } else {
        throw new Error('Username and password are required');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed. Please check your credentials.');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('lawgpt_auth');
    localStorage.removeItem('lawgpt_user');
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

