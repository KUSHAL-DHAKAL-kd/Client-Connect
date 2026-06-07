import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PrivateRoute — wraps a route that requires authentication.
 * @param {string} role - optional: 'admin' or 'patient' to restrict by role
 */
const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: 'var(--bg-gradient, #f1f5f9)',
        fontSize: '1rem', color: '#64748b',
      }}>
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // Redirect to the correct dashboard if user has wrong role
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/patient/dashboard'} replace />;
  }

  return children;
};

export default PrivateRoute;
