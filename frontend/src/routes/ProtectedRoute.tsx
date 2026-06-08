import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import type { Role } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";

type Props = {
  children: ReactNode;
  allowedRole: Role;
};

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== allowedRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
