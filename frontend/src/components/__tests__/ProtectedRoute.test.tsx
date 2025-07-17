import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import { useAuth } from "../../hooks/useAuth";

// Mock the useAuth hook
vi.mock("../../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

const mockUser = {
  _id: "1",
  name: "John Doe",
  email: "john@example.com",
  photo: "user-1.jpg",
  role: "user" as const,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

const mockAdminUser = {
  ...mockUser,
  role: "admin" as const,
};

const renderProtectedRoute = (children: React.ReactNode, props = {}) => {
  return render(
    <BrowserRouter>
      <ProtectedRoute {...props}>{children}</ProtectedRoute>
    </BrowserRouter>
  );
};

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading spinner when loading is true", () => {
    const mockUseAuth = vi.mocked(useAuth);
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      updatePassword: vi.fn(),
      uploadPhoto: vi.fn(),
    });

    renderProtectedRoute(<div>Protected Content</div>);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("should render children when user is authenticated and not loading", () => {
    const mockUseAuth = vi.mocked(useAuth);
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      updatePassword: vi.fn(),
      uploadPhoto: vi.fn(),
    });

    renderProtectedRoute(<div>Protected Content</div>);

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("should redirect to login when user is not authenticated", () => {
    const mockUseAuth = vi.mocked(useAuth);
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      updatePassword: vi.fn(),
      uploadPhoto: vi.fn(),
    });

    renderProtectedRoute(<div>Protected Content</div>);

    // The component should redirect, so protected content should not be visible
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("should render children for admin-only route when user is admin", () => {
    const mockUseAuth = vi.mocked(useAuth);
    mockUseAuth.mockReturnValue({
      user: mockAdminUser,
      loading: false,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      updatePassword: vi.fn(),
      uploadPhoto: vi.fn(),
    });

    renderProtectedRoute(<div>Admin Content</div>, { adminOnly: true });

    expect(screen.getByText("Admin Content")).toBeInTheDocument();
  });

  it("should redirect non-admin user from admin-only route", () => {
    const mockUseAuth = vi.mocked(useAuth);
    mockUseAuth.mockReturnValue({
      user: mockUser, // regular user, not admin
      loading: false,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      updatePassword: vi.fn(),
      uploadPhoto: vi.fn(),
    });

    renderProtectedRoute(<div>Admin Content</div>, { adminOnly: true });

    // Should redirect, so admin content should not be visible
    expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();
  });

  it("should redirect authenticated user from non-auth route", () => {
    const mockUseAuth = vi.mocked(useAuth);
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      updatePassword: vi.fn(),
      uploadPhoto: vi.fn(),
    });

    renderProtectedRoute(<div>Login Form</div>, { requireAuth: false });

    // Should redirect authenticated user away from login/signup pages
    expect(screen.queryByText("Login Form")).not.toBeInTheDocument();
  });
});
