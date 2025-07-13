import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider } from "../AuthContext.tsx";
import { useAuth } from "../../hooks/useAuth";
import { apiService } from "../../services/api";

// Mock the API service
vi.mock("../../services/api", () => ({
  apiService: {
    getMe: vi.fn(),
    login: vi.fn(),
    signup: vi.fn(),
    updateUserData: vi.fn(),
    updatePassword: vi.fn(),
    uploadPhoto: vi.fn(),
    isAuthenticated: vi.fn(),
    logout: vi.fn(),
  },
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

// Test component that uses the auth context
const TestComponent = () => {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <div>
          <span>Welcome, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => login("test@example.com", "password")}>
          Login
        </button>
      )}
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should show login button when no user is authenticated", async () => {
    const mockGetMe = vi.mocked(apiService.getMe);
    const mockIsAuthenticated = vi.mocked(apiService.isAuthenticated);

    mockIsAuthenticated.mockReturnValue(false);
    mockGetMe.mockRejectedValue(new Error("Not authenticated"));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Login")).toBeInTheDocument();
    });
  });

  it("should show user info when authenticated", async () => {
    const mockGetMe = vi.mocked(apiService.getMe);
    const mockIsAuthenticated = vi.mocked(apiService.isAuthenticated);

    mockIsAuthenticated.mockReturnValue(true);
    mockGetMe.mockResolvedValue({
      status: "success",
      data: mockUser,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Welcome, John Doe")).toBeInTheDocument();
    });
  });

  it("should handle logout", async () => {
    const mockGetMe = vi.mocked(apiService.getMe);
    const mockIsAuthenticated = vi.mocked(apiService.isAuthenticated);
    const mockLogout = vi.mocked(apiService.logout);

    mockIsAuthenticated.mockReturnValue(true);
    mockGetMe.mockResolvedValue({
      status: "success",
      data: mockUser,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Welcome, John Doe")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Logout"));

    expect(mockLogout).toHaveBeenCalled();
  });
});
