import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type AllowedRole = "INVESTOR" | "ADMIN";

interface ProtectedProps {
  allowedRole?: AllowedRole | AllowedRole[];
}

export const ProtectedRoutes = ({ allowedRole }: ProtectedProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  console.log(user);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole) {
    const allowedRoles = Array.isArray(allowedRole)
      ? allowedRole
      : [allowedRole];
    if (!allowedRoles.includes(user.role as AllowedRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};
