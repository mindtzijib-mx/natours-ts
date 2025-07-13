import React, { useState } from "react";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading?: boolean;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="login-form">
      <h2 className="heading-secondary ma-bt-lg">Log into your account</h2>

      {error && <div className="alert alert--error">{error}</div>}

      <form className="form form--login" onSubmit={handleSubmit}>
        <div className="form__group">
          <label className="form__label" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            className={`form__input ${
              errors.email ? "form__input--error" : ""
            }`}
            type="email"
            name="email"
            placeholder="you@example.com"
            required
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.email && <span className="form__error">{errors.email}</span>}
        </div>

        <div className="form__group ma-bt-md">
          <label className="form__label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className={`form__input ${
              errors.password ? "form__input--error" : ""
            }`}
            type="password"
            name="password"
            placeholder="••••••••"
            required
            minLength={8}
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.password && (
            <span className="form__error">{errors.password}</span>
          )}
        </div>

        <div className="form__group">
          <button className="btn btn--green" type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
