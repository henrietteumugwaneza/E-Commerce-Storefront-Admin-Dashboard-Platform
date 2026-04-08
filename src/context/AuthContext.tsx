import { createContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../api/axios";
import type { User, Role } from "../types";

interface AuthContextType {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  });

  const role: Role | null = user?.role ?? null;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const saved = localStorage.getItem("user");
    if (token && saved) {
      try { setUser(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/users/login", { email, password });
    const { token, user: apiUser } = res.data.data;
    // The API cannot assign ADMIN role via registration, so we decode the JWT
    // to get the real role the server signed into the token
    let role: Role = apiUser.role;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role) role = payload.role;
    } catch { /* use apiUser.role as fallback */ }
    const u: User = { ...apiUser, role };
    setUser(u);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
