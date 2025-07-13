import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <h2 className="heading-secondary ma-bt-lg">Log into your account</h2>
      <form className="form form--login" onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert--error">
            <p>{error}</p>
          </div>
        )}

        <div className="form__group">
          <label className="form__label" htmlFor="email">
            Email address
          </label>
          <input
            className="form__input"
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
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
            placeholder="••••••••"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form__group">
          <button className="btn btn--green" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>

      <div
        className="form__group"
        style={{ marginTop: "2rem", textAlign: "center" }}
      >
        <p>
          Don't have an account?{" "}
          <a href="/signup" className="btn-text">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
