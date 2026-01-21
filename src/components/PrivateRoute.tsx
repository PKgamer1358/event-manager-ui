import React, { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PrivateRouteProps {
  children: JSX.Element;
  adminOnly?: boolean;
  superAdminOnly?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  adminOnly = false,
  superAdminOnly = false,
}) => {
  const { isAuthenticated, isAdmin, isSuperAdmin, loading } = useAuth();
  const location = useLocation();

  // ⏳ Wait until auth state is restored
  if (loading) {
    return null; // or a spinner if you want
  }

  // 🔒 Not logged in → redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // 🔐 Super admin only route
  if (superAdminOnly && !isSuperAdmin) {
    return <Navigate to="/events" replace />;
  }

  // 🔐 Admin only route
  if (adminOnly && !isAdmin && !isSuperAdmin) {
    return <Navigate to="/events" replace />;
  }

  // ✅ Access granted
  return children;
};

export default PrivateRoute;
