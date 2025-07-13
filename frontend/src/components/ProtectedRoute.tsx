import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  adminOnly = false,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading__spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If route requires auth but user is not logged in
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route requires admin but user is not admin
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // If route is for non-authenticated users but user is logged in
  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
