import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { apiService } from "../services/api";
import type { User } from "../services/api";
import { AuthContext, type AuthContextType } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token && apiService.isAuthenticated()) {
        try {
          const response = await apiService.getMe();
          setUser(response.data);
        } catch (error) {
          console.error("Failed to get user data:", error);
          apiService.logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiService.login(email, password);
    localStorage.setItem("token", response.token);
    setUser(response.data.user);
  };

  const signup = async (userData: {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }) => {
    const response = await apiService.signup(userData);
    localStorage.setItem("token", response.token);
    setUser(response.data.user);
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  const updateUser = async (userData: { name?: string; email?: string }) => {
    const response = await apiService.updateUserData(userData);
    setUser(response.data.user);
  };

  const updatePassword = async (passwordData: {
    passwordCurrent: string;
    password: string;
    passwordConfirm: string;
  }) => {
    const response = await apiService.updatePassword(passwordData);
    setUser(response.data.user);
  };

  const uploadPhoto = async (formData: FormData) => {
    const response = await apiService.uploadPhoto(formData);
    setUser(response.data.user);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUser,
    updatePassword,
    uploadPhoto,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
