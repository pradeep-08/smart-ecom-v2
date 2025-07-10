import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles?: Array<"admin" | "user">;
}

export default function RequireAuth({ children, allowedRoles = ["user", "admin"] }: RequireAuthProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // You could render a loading spinner here
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    // Redirect to login if not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to home if not authorized
    return <Navigate to="/" replace />;
  }

  // User is authorized, render the children
  return <>{children}</>;
}
