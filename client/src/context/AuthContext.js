import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkLoggedIn = async () => {
      if (token) {
        try {
          // Set default auth header for all requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get current user data
          const response = await axios.get('/api/auth/me');
          setCurrentUser(response.data);
        } catch (err) {
          console.error('Authentication error:', err);
          // Clear invalid token
          localStorage.removeItem('token');
          setToken(null);
          setError('Session expired. Please log in again.');
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, [token]);

  // Register new user
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/register', userData);
      const { token, userId } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      setToken(token);
      
      // Set default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Get user data
      const userResponse = await axios.get('/api/auth/me');
      setCurrentUser(userResponse.data);
      
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error?.message || 'Registration failed');
      return { success: false, error: err.response?.data?.error?.message || 'Registration failed' };
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login', credentials);
      const { token, userId } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      setToken(token);
      
      // Set default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Get user data
      const userResponse = await axios.get('/api/auth/me');
      setCurrentUser(userResponse.data);
      
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error?.message || 'Login failed');
      return { success: false, error: err.response?.data?.error?.message || 'Login failed' };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Remove token regardless of API success
      localStorage.removeItem('token');
      setToken(null);
      setCurrentUser(null);
      // Clear auth header
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.put(`/api/users/${currentUser._id}`, userData);
      setCurrentUser({...currentUser, ...response.data});
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error?.message || 'Update failed');
      return { success: false, error: err.response?.data?.error?.message || 'Update failed' };
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      await axios.put('/api/auth/password', passwordData);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error?.message || 'Password change failed');
      return { success: false, error: err.response?.data?.error?.message || 'Password change failed' };
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
