import React, { useState } from "react";
import AccountForm from "../components/AccountForm";
import { useAuth } from "../hooks/useAuth";
import apiService from "../services/api";

interface UserData {
  name: string;
  email: string;
}

interface PasswordData {
  passwordCurrent: string;
  password: string;
  passwordConfirm: string;
}

const Account: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleUpdateUserData = async (data: UserData) => {
    setIsLoading(true);
    setError(undefined);

    try {
      const response = await apiService.updateUserData(data);
      updateUser(response.data.user);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to update user data. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (data: PasswordData) => {
    setIsLoading(true);
    setError(undefined);

    try {
      const response = await apiService.updatePassword(data);
      updateUser(response.data.user);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to update password. Please check your current password.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const NavItem: React.FC<{
    link: string;
    text: string;
    icon: string;
    active?: boolean;
  }> = ({ link, text, icon, active = false }) => (
    <li className={active ? "side-nav--active" : ""}>
      <a href={link}>
        <svg>
          <use xlinkHref={`/icons.svg#icon-${icon}`}></use>
        </svg>
        {text}
      </a>
    </li>
  );

  return (
    <main className="main">
      <div className="user-view">
        <nav className="user-view__menu">
          <ul className="side-nav">
            <NavItem link="#" text="Settings" icon="settings" active={true} />
            <NavItem link="#" text="My bookings" icon="briefcase" />
            <NavItem link="#" text="My reviews" icon="star" />
            <NavItem link="#" text="Billing" icon="credit-card" />
          </ul>

          {user?.role === "admin" && (
            <div className="admin-nav">
              <h5 className="admin-nav__heading">Admin</h5>
              <ul className="side-nav">
                <NavItem link="#" text="Manage tours" icon="map" />
                <NavItem link="#" text="Manage users" icon="users" />
                <NavItem link="#" text="Manage reviews" icon="star" />
                <NavItem link="#" text="Manage bookings" icon="briefcase" />
              </ul>
            </div>
          )}
        </nav>

        {user && (
          <AccountForm
            user={user}
            onUpdateUserData={handleUpdateUserData}
            onUpdatePassword={handleUpdatePassword}
            isLoading={isLoading}
            error={error}
          />
        )}
      </div>
    </main>
  );
};

export default Account;
