import { createContext, useEffect, useState } from "react";

type Role = "ADMIN" | "USER" | null;

interface AuthType {
  role: Role;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthType>(null!);

export const AuthProvider = ({ children }: any) => {
  const [role, setRole] = useState<Role>(null);

  useEffect(() => {
    const saved = localStorage.getItem("role");
    if (saved) setRole(saved as Role);
  }, []);

  const login = (email: string, password: string) => {
    if (email === "admin@admin.com" && password === "admin123") {
      setRole("ADMIN");
      localStorage.setItem("role", "ADMIN");
    } else {
      setRole("USER");
      localStorage.setItem("role", "USER");
    }
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{
      role,
      isAuthenticated: !!role,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};