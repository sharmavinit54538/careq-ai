import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (!isAuthenticated || !user) {
    return <Navigate to={`/auth/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Check if role is allowed
  if (!allowedRoles.includes(user.role)) {
    // Redirect to unauthorized page with details or their own dashboard
    return (
      <Navigate
        to="/unauthorized"
        state={{
          attemptedPath: location.pathname,
          userRole: user.role,
          requiredRoles: allowedRoles
        }}
        replace
      />
    );
  }

  return <>{children}</>;
};
