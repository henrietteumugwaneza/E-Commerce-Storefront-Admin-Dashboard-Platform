import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { type ReactNode } from "react";

export const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { role } = useAuth();
  return role === "ADMIN" ? <>{children}</> : <Navigate to="/" replace />;
};

export const UserRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};
