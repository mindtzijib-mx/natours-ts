import React, { useState, useEffect, useRef } from "react";

interface User {
  name: string;
  email: string;
  photo: string | undefined;
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
  onPhotoUpdate?: (newPhoto: string) => void;
  isLoading?: boolean;
  error?: string;
}

const AccountForm: React.FC<AccountFormProps> = ({
  user,
  onUpdateUserData,
  onUpdatePassword,
  onPhotoUpdate,
  isLoading = false,
  error,
}) => {
  const [userData, setUserData] = useState<UserData>({
    name: user.name || "",
    email: user.email || "",
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

  // Photo upload states
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [photoTimestamp, setPhotoTimestamp] = useState<number>(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local state when user data changes
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Update photo timestamp when user photo changes
  useEffect(() => {
    if (user?.photo) {
      setPhotoTimestamp(Date.now());
    }
  }, [user?.photo]);

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

  // Photo upload functions
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith("image/")) {
        alert("Por favor selecciona solo archivos de imagen");
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen debe ser menor a 5MB");
        return;
      }

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Subir archivo
      uploadPhoto(file);
    }
  };

  const uploadPhoto = async (file: File) => {
    setIsUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const token = localStorage.getItem("token"); // Asume que tienes el token guardado

      const response = await fetch(
        "http://localhost:3000/api/v1/users/updateMe",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error al subir la foto");
      }

      const data = await response.json();

      if (data.status === "success") {
        const newPhotoUrl = data.data.user.photo;
        onPhotoUpdate?.(newPhotoUrl);
        setPreviewPhoto(null); // Clear preview since we now have the new photo
        setPhotoTimestamp(Date.now()); // Update timestamp to force image refresh
        alert("Foto actualizada exitosamente!");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Error al subir la foto. Inténtalo de nuevo.");
      setPreviewPhoto(null);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const getPhotoUrl = () => {
    if (previewPhoto) return previewPhoto;
    const photoName = user.photo || "default.jpg";
    // Use the new API endpoint that handles CORS properly
    return `http://localhost:3000/api/v1/users/photo/${photoName}?t=${photoTimestamp}`;
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
              src={getPhotoUrl()}
              alt="User photo"
              style={{
                opacity: isUploadingPhoto ? 0.6 : 1,
                transition: "opacity 0.3s ease",
              }}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: "none" }}
              disabled={isUploadingPhoto}
            />
            <button
              type="button"
              className="btn-text"
              onClick={handlePhotoClick}
              disabled={isUploadingPhoto}
            >
              {isUploadingPhoto ? "Uploading..." : "Choose new photo"}
            </button>
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
