import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AccountForm from "../AccountForm";

const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  photo: "user-1.jpg",
};

const mockProps = {
  user: mockUser,
  onUpdateUserData: vi.fn(),
  onUpdatePassword: vi.fn(),
  isLoading: false,
  error: undefined,
};

describe("AccountForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render with user data populated", () => {
    render(<AccountForm {...mockProps} />);

    const nameInput = screen.getByDisplayValue("John Doe");
    const emailInput = screen.getByDisplayValue("john@example.com");

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
  });

  it("should handle user with undefined name and email", () => {
    const userWithUndefinedData = {
      name: undefined as any,
      email: undefined as any,
      photo: "user-1.jpg",
    };

    render(<AccountForm {...mockProps} user={userWithUndefinedData} />);

    const nameInput = screen.getByLabelText("Name") as HTMLInputElement;
    const emailInput = screen.getByLabelText(
      "Email address"
    ) as HTMLInputElement;

    // Should not crash and should have empty values
    expect(nameInput.value).toBe("");
    expect(emailInput.value).toBe("");
  });

  it("should handle user with null name and email", () => {
    const userWithNullData = {
      name: null as any,
      email: null as any,
      photo: "user-1.jpg",
    };

    render(<AccountForm {...mockProps} user={userWithNullData} />);

    const nameInput = screen.getByLabelText("Name") as HTMLInputElement;
    const emailInput = screen.getByLabelText(
      "Email address"
    ) as HTMLInputElement;

    // Should not crash and should have empty values
    expect(nameInput.value).toBe("");
    expect(emailInput.value).toBe("");
  });

  it("should update form when user prop changes", async () => {
    const { rerender } = render(<AccountForm {...mockProps} />);

    // Initial render with original user
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();

    // Update user prop
    const updatedUser = {
      name: "Jane Smith",
      email: "jane@example.com",
      photo: "user-2.jpg",
    };

    rerender(<AccountForm {...mockProps} user={updatedUser} />);

    // Should update the form values
    await waitFor(() => {
      expect(screen.getByDisplayValue("Jane Smith")).toBeInTheDocument();
      expect(screen.getByDisplayValue("jane@example.com")).toBeInTheDocument();
    });
  });

  it("should handle user data update from undefined to defined", async () => {
    const userWithUndefinedData = {
      name: undefined as any,
      email: undefined as any,
      photo: "user-1.jpg",
    };

    const { rerender } = render(
      <AccountForm {...mockProps} user={userWithUndefinedData} />
    );

    // Initially should have empty values
    const nameInput = screen.getByLabelText("Name") as HTMLInputElement;
    const emailInput = screen.getByLabelText(
      "Email address"
    ) as HTMLInputElement;
    expect(nameInput.value).toBe("");
    expect(emailInput.value).toBe("");

    // Update to user with defined data
    rerender(<AccountForm {...mockProps} user={mockUser} />);

    // Should populate the form
    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
      expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    });
  });

  it("should validate required fields", async () => {
    render(<AccountForm {...mockProps} />);

    const nameInput = screen.getByLabelText("Name");
    const submitButton = screen.getByText("Save settings");

    // Clear the name field
    fireEvent.change(nameInput, { target: { value: "" } });

    // Submit the form
    fireEvent.submit(submitButton.closest("form")!);

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
  });

  it("should call onUpdateUserData when form is submitted with valid data", async () => {
    render(<AccountForm {...mockProps} />);

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email address");
    const submitButton = screen.getByText("Save settings");

    fireEvent.change(nameInput, { target: { value: "Updated Name" } });
    fireEvent.change(emailInput, { target: { value: "updated@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockProps.onUpdateUserData).toHaveBeenCalledWith({
        name: "Updated Name",
        email: "updated@example.com",
      });
    });
  });
});
