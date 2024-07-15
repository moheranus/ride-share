import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    return !!token;
  });
  const [userRole, setUserRole] = useState(() => localStorage.getItem('role'));
  const [username, setUsername] = useState(() => localStorage.getItem('username'));

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const storedUsername = localStorage.getItem('username');
      if (token && role && storedUsername) {
        setIsAuthenticated(true);
        setUserRole(role);
        setUsername(storedUsername);
      }
    };
    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', username);
      setIsAuthenticated(true);
      setUserRole(role);
      setUsername(username);
      return { username, role };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }
  };

  const register = async (username, email, password) => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
    } catch (error) {
      console.error('Registration error:', error);
    }
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUserRole(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ login, register, isAuthenticated, userRole, logout, username }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
