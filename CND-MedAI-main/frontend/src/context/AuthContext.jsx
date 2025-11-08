import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Resolve API base URL
  const apiBase = (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim())
    ? process.env.REACT_APP_API_URL.trim()
    : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:5000'
      : '';

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Try a silent auth check with the server. We DO NOT bail out early when there's no
      // token in localStorage because the server may be using httpOnly cookies for auth.
      const token = localStorage.getItem('token');

      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Keep loading=true until the server responds so ProtectedRoute doesn't redirect on refresh
      const response = await fetch(`${apiBase}/api/auth/me`, {
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          // No user data; clear any stale token but remain unauthenticated
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // 401/403 or other client error - clear token and mark unauthenticated
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // On network error, don't aggressively clear UI; treat as unauthenticated but keep UX stable
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.user) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        setUser(data.user);
        setIsAuthenticated(true);
        toast({
          title: 'Welcome back!',
          description: 'Successfully logged in',
        });
        return { success: true };
      } else {
        // Let caller decide how to render inline errors; still toast for non-auth errors
        if (response.status >= 500) {
          toast({
            title: 'Server error',
            description: data.message || 'Please try again later',
            variant: 'destructive',
          });
        }
        return { success: false, error: data.message || (response.status === 401 ? 'Invalid email or password' : 'Login failed'), status: response.status };
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBase}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'Account created successfully. Please sign in.',
        });
        return { success: true };
      } else {
        toast({
          title: 'Registration failed',
          description: data.message || 'Could not create account',
          variant: 'destructive',
        });
        return { success: false, error: data.message };
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${apiBase}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
