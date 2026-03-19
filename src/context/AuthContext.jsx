import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const initializeAuth = async () => {
      const token = localStorage.getItem('dt_token');
      const savedUser = localStorage.getItem('dt_user');
      
      if (token && savedUser) {
        try {
          // In a full implementation, we'd verify the token with the backend here
          // For now, we'll trust the localStorage but set headers for future requests
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          console.log("AuthContext: Session resumed for", parsedUser.email);
        } catch (e) {
          console.error("AuthContext: Session restoration failed", e);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      setUser(userData);
      localStorage.setItem('dt_token', token);
      localStorage.setItem('dt_user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return userData;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Login failed');
    }
  };

  const signup = async (email, name, password) => {
    try {
      const response = await axios.post('/api/auth/signup', { email, name, password });
      const { token, user: userData } = response.data;
      
      setUser(userData);
      localStorage.setItem('dt_token', token);
      localStorage.setItem('dt_user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return userData;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Signup failed');
    }
  };

  const oauthLogin = async (provider, providerData) => {
    try {
      const response = await axios.post('/api/auth/oauth', {
        provider,
        ...providerData
      });
      const { token, user: userData } = response.data;
      
      setUser(userData);
      localStorage.setItem('dt_token', token);
      localStorage.setItem('dt_user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return userData;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'OAuth failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dt_token');
    localStorage.removeItem('dt_user');
    localStorage.removeItem('currentAnalysis');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      signup, 
      oauthLogin,
      logout, 
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
