import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../authcontext/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
