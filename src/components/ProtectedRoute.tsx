import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const AdminRoute = ({ children }: any) => {
  const { role } = useAuth();
  return role === "ADMIN" ? children : <Navigate to="/" />;
};

export const UserRoute = ({ children }: any) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};