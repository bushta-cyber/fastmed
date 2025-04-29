import React, { createContext, useState, useEffect, useContext } from "react";
import {
  getCurrentUser,
  login,
  register,
  // logout as doLogout,
} from "../services/authService";
import { UserProfile } from "../types/auth";

interface AuthContextType {
  user: UserProfile | null;
  loginUser: (email: string, password: string) => Promise<void>;
  logout: () => void;
  registerUser: (username: string, email: string, password: string, role: 'patient' | 'doctor') => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const u = await getCurrentUser();
        setUser(u);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const loginUser = async (email: string, password: string) => {
    await login({ email, password });
    const u = await getCurrentUser();
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  const registerUser = async (username: string, email: string, password: string, role: 'patient' | 'doctor') => {
    try {
      await register({ username, email, password, role });
      const u = await getCurrentUser();
      setUser(u);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };


  return (
    <AuthContext.Provider
      value={{ user, loginUser, logout, registerUser ,isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
