import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { User } from "../services/api";

const Header: React.FC = () => {
  const { user, logout, loading } = useAuth();

  // Function to get user image with fallback
  const getUserImage = (user: User) => {
    const photoName = user.photo || "default.jpg";
    // Use the new API endpoint that handles CORS properly
    return `http://localhost:3000/api/v1/users/photo/${photoName}`;
  };

  return (
    <header className="header">
      <nav className="nav nav--tours">
        <Link to="/" className="nav__el">
          All tours
        </Link>
      </nav>

      <div className="header__logo">
        <img src="/logo-white.png" alt="Natours Logo" />
      </div>

      <nav className="nav nav--user">
        {user ? (
          <>
            <button onClick={logout} className="nav__el nav__el--logout">
              Log out
            </button>
            <Link to="/account" className="nav__el">
              <img
                className="nav__user-img"
                src={getUserImage(user)}
                alt={`Photo of ${user.name}`}
                onError={(e) => {
                  // Fallback to default image if the user image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "http://localhost:3000/api/v1/users/photo/default.jpg";
                }}
              />
              <span>
                {loading ? "Loading..." : user.name?.split(" ")[0] || "User"}
              </span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav__el">
              Log in
            </Link>
            <Link to="/signup" className="nav__el nav__el--cta">
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
