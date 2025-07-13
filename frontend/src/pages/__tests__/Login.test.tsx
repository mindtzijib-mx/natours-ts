import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Login from "../Login";
import { useAuth } from "../../hooks/useAuth";

// Mock the useAuth hook
vi.mock("../../hooks/useAuth");
const mockUseAuth = vi.mocked(useAuth);

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Wrapper component for testing with Router
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("Login", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      user: null,
      loading: false,
      signup: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
      updatePassword: vi.fn(),
      uploadPhoto: vi.fn(),
    });
  });

  it("renders login form correctly", () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    expect(screen.getByText("Log into your account")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("handles form submission successfully", async () => {
    mockLogin.mockResolvedValue(undefined);

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText("Email address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Login" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("displays error message when login fails", async () => {
    const errorMessage = "Invalid credentials";
    mockLogin.mockRejectedValue(new Error(errorMessage));

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText("Email address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Login" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("shows loading state during form submission", async () => {
    mockLogin.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText("Email address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Login" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Logging in...")).toBeInTheDocument();
    });

    expect(submitButton).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
  });

  it("validates required fields", () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const submitButton = screen.getByRole("button", { name: "Login" });
    fireEvent.click(submitButton);

    // HTML5 validation should prevent submission
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("validates email format", () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText("Email address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Login" });

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    // HTML5 validation should prevent submission
    expect(mockLogin).not.toHaveBeenCalled();
  });
});
