import { createContext } from "react";
import type { User } from "../services/api";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  updatePassword: (passwordData: {
    passwordCurrent: string;
    password: string;
    passwordConfirm: string;
  }) => Promise<void>;
  uploadPhoto: (formData: FormData) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
