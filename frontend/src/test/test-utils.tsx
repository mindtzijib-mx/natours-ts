import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext.tsx";

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </AuthProvider>
  );
};

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react";

// Override render method
export { customRender as render };
