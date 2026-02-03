import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedProps {
  allowedRole?: "USER" | "INVESTOR" | "ADMIN" | "PROPERTY_OWNER";
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

  // FIXED LINE: Cast user.role to string to allow comparison
  if (allowedRole && (user.role as string) !== (allowedRole as string)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};