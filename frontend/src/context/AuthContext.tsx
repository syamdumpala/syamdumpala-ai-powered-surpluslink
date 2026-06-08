import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type Role = "restaurant" | "volunteer" | "ngo" | "admin";

type AuthContextType = {
  isAuthenticated: boolean;
  role: Role | null;
  userEmail: string | null;
  login: (role: Role, email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(() => {
    const storedRole = localStorage.getItem("role");
    return isRole(storedRole) ? storedRole : null;
  });
  const [userEmail, setUserEmail] = useState<string | null>(() =>
    localStorage.getItem("userEmail")
  );

  const isAuthenticated = Boolean(role && localStorage.getItem("token"));

  useEffect(() => {
    if (role) {
      localStorage.setItem("role", role);
      return;
    }

    localStorage.removeItem("role");
  }, [role]);

  const login = (userRole: Role, email: string) => {
    localStorage.setItem("token", `demo-${userRole}-${Date.now()}`);
    localStorage.setItem("role", userRole);
    localStorage.setItem("userEmail", email);
    setRole(userRole);
    setUserEmail(email);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userEmail");
    setRole(null);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, role, userEmail, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

function isRole(value: string | null): value is Role {
  return (
    value === "restaurant" ||
    value === "volunteer" ||
    value === "ngo" ||
    value === "admin"
  );
}
