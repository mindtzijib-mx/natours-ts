import React, { useState } from "react";

interface User {
  name: string;
  email: string;
  photo: string;
}

interface UserData {
  name: string;
  email: string;
}

interface PasswordData {
  passwordCurrent: string;
  password: string;
  passwordConfirm: string;
}

interface AccountFormProps {
  user: User;
  onUpdateUserData: (data: UserData) => void;
  onUpdatePassword: (data: PasswordData) => void;
  isLoading?: boolean;
  error?: string;
}

const AccountForm: React.FC<AccountFormProps> = ({
  user,
  onUpdateUserData,
  onUpdatePassword,
  isLoading = false,
  error,
}) => {
  const [userData, setUserData] = useState<UserData>({
    name: user.name,
    email: user.email,
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    passwordCurrent: "",
    password: "",
    passwordConfirm: "",
  });

  const [userErrors, setUserErrors] = useState<Partial<UserData>>({});
  const [passwordErrors, setPasswordErrors] = useState<Partial<PasswordData>>(
    {}
  );

  const validateUserData = (): boolean => {
    const errors: Partial<UserData> = {};

    if (!userData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!userData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = "Email is invalid";
    }

    setUserErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordData = (): boolean => {
    const errors: Partial<PasswordData> = {};

    if (!passwordData.passwordCurrent) {
      errors.passwordCurrent = "Current password is required";
    }

    if (!passwordData.password) {
      errors.password = "New password is required";
    } else if (passwordData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!passwordData.passwordConfirm) {
      errors.passwordConfirm = "Password confirmation is required";
    } else if (passwordData.password !== passwordData.passwordConfirm) {
      errors.passwordConfirm = "Passwords do not match";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (userErrors[name as keyof UserData]) {
      setUserErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (passwordErrors[name as keyof PasswordData]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleUserDataSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUserData()) {
      onUpdateUserData(userData);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePasswordData()) {
      onUpdatePassword(passwordData);
      // Clear password form after successful submission
      setPasswordData({
        passwordCurrent: "",
        password: "",
        passwordConfirm: "",
      });
    }
  };

  return (
    <div className="user-view__content">
      {error && <div className="alert alert--error">{error}</div>}

      <div className="user-view__form-container">
        <h2 className="heading-secondary ma-bt-md">Your account settings</h2>

        <form className="form form-user-data" onSubmit={handleUserDataSubmit}>
          <div className="form__group">
            <label className="form__label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className={`form__input ${
                userErrors.name ? "form__input--error" : ""
              }`}
              type="text"
              name="name"
              value={userData.name}
              required
              onChange={handleUserDataChange}
              disabled={isLoading}
            />
            {userErrors.name && (
              <span className="form__error">{userErrors.name}</span>
            )}
          </div>

          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              className={`form__input ${
                userErrors.email ? "form__input--error" : ""
              }`}
              type="email"
              name="email"
              value={userData.email}
              required
              onChange={handleUserDataChange}
              disabled={isLoading}
            />
            {userErrors.email && (
              <span className="form__error">{userErrors.email}</span>
            )}
          </div>

          <div className="form__group form__photo-upload">
            <img
              className="form__user-photo"
              src={`/img/users/${user.photo}`}
              alt="User photo"
            />
            <a href="#" className="btn-text">
              Choose new photo
            </a>
          </div>

          <div className="form__group right">
            <button
              className="btn btn--small btn--green"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save settings"}
            </button>
          </div>
        </form>
      </div>

      <div className="line">&nbsp;</div>

      <div className="user-view__form-container">
        <h2 className="heading-secondary ma-bt-md">Password change</h2>
        <form
          className="form form-user-password"
          onSubmit={handlePasswordSubmit}
        >
          <div className="form__group">
            <label className="form__label" htmlFor="password-current">
              Current password
            </label>
            <input
              id="password-current"
              className={`form__input ${
                passwordErrors.passwordCurrent ? "form__input--error" : ""
              }`}
              type="password"
              name="passwordCurrent"
              placeholder="••••••••"
              required
              minLength={8}
              value={passwordData.passwordCurrent}
              onChange={handlePasswordChange}
              disabled={isLoading}
            />
            {passwordErrors.passwordCurrent && (
              <span className="form__error">
                {passwordErrors.passwordCurrent}
              </span>
            )}
          </div>

          <div className="form__group">
            <label className="form__label" htmlFor="password">
              New password
            </label>
            <input
              id="password"
              className={`form__input ${
                passwordErrors.password ? "form__input--error" : ""
              }`}
              type="password"
              name="password"
              placeholder="••••••••"
              required
              minLength={8}
              value={passwordData.password}
              onChange={handlePasswordChange}
              disabled={isLoading}
            />
            {passwordErrors.password && (
              <span className="form__error">{passwordErrors.password}</span>
            )}
          </div>

          <div className="form__group ma-bt-lg">
            <label className="form__label" htmlFor="password-confirm">
              Confirm password
            </label>
            <input
              id="password-confirm"
              className={`form__input ${
                passwordErrors.passwordConfirm ? "form__input--error" : ""
              }`}
              type="password"
              name="passwordConfirm"
              placeholder="••••••••"
              required
              minLength={8}
              value={passwordData.passwordConfirm}
              onChange={handlePasswordChange}
              disabled={isLoading}
            />
            {passwordErrors.passwordConfirm && (
              <span className="form__error">
                {passwordErrors.passwordConfirm}
              </span>
            )}
          </div>

          <div className="form__group right">
            <button
              className="btn btn--small btn--green btn--save-password"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountForm;
