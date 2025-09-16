import React from 'react';
import { Navigate } from 'react-router-dom';

interface MiddlewareRouteProps {
  children: JSX.Element;
  isAuthenticated: boolean;
  role?: 'manager' | 'employee';
  requiredRole?: 'manager' | 'employee';
}

const MiddlewareRoute: React.FC<MiddlewareRouteProps> = ({
  children,
  isAuthenticated,
  role,
  requiredRole,
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default MiddlewareRoute;
