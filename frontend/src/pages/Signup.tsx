import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import apiService from "../services/api";

interface SignupData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<SignupData>({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic validation
    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      await apiService.signup(formData);

      // Auto-login after successful signup
      await login(formData.email, formData.password);

      // Redirect to home page
      navigate("/");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to create account. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Create your account</h2>
        <form className="form form--signup" onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert--error">
              <p>{error}</p>
            </div>
          )}

          <div className="form__group">
            <label className="form__label" htmlFor="name">
              Full Name
            </label>
            <input
              className="form__input"
              id="name"
              type="text"
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form__group">
            <label className="form__label" htmlFor="email">
              Email address
            </label>
            <input
              className="form__input"
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="password">
              Password
            </label>
            <input
              className="form__input"
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={8}
            />
          </div>

          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="passwordConfirm">
              Confirm Password
            </label>
            <input
              className="form__input"
              id="passwordConfirm"
              type="password"
              name="passwordConfirm"
              placeholder="••••••••"
              value={formData.passwordConfirm}
              onChange={handleInputChange}
              required
              minLength={8}
            />
          </div>

          <div className="form__group">
            <button
              className="btn btn--green"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </button>
          </div>
        </form>

        <div
          className="form__group"
          style={{ marginTop: "2rem", textAlign: "center" }}
        >
          <p>
            Already have an account?{" "}
            <a href="/login" className="btn-text">
              Log in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Signup;
