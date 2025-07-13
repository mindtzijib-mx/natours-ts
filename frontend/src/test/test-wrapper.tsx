import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext.tsx";

export const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </AuthProvider>
  );
};
