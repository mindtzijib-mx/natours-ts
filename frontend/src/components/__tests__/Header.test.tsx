import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Header from "../Header";
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

const renderHeader = () => {
  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
};

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show login/signup links when no user is authenticated", () => {
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

    renderHeader();

    expect(screen.getByText("Log in")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });

  it("should show user info when authenticated and not loading", () => {
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

    renderHeader();

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });

  it("should show 'Loading...' when user exists but loading is true", () => {
    const mockUseAuth = vi.mocked(useAuth);
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: true,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      updatePassword: vi.fn(),
      uploadPhoto: vi.fn(),
    });

    renderHeader();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should handle user with undefined name gracefully", () => {
    const mockUseAuth = vi.mocked(useAuth);
    const userWithoutName = { ...mockUser, name: undefined as any };

    mockUseAuth.mockReturnValue({
      user: userWithoutName,
      loading: false,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      updatePassword: vi.fn(),
      uploadPhoto: vi.fn(),
    });

    renderHeader();

    expect(screen.getByText("User")).toBeInTheDocument();
  });

  it("should handle user with empty name gracefully", () => {
    const mockUseAuth = vi.mocked(useAuth);
    const userWithEmptyName = { ...mockUser, name: "" };

    mockUseAuth.mockReturnValue({
      user: userWithEmptyName,
      loading: false,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      updatePassword: vi.fn(),
      uploadPhoto: vi.fn(),
    });

    renderHeader();

    expect(screen.getByText("User")).toBeInTheDocument();
  });

  it("should show 'User' when user exists but name is null", () => {
    const mockUseAuth = vi.mocked(useAuth);
    const userWithNullName = { ...mockUser, name: null as any };

    mockUseAuth.mockReturnValue({
      user: userWithNullName,
      loading: false,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      updatePassword: vi.fn(),
      uploadPhoto: vi.fn(),
    });

    renderHeader();

    expect(screen.getByText("User")).toBeInTheDocument();
  });
});
