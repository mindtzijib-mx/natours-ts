import React, { useState, useRef } from "react";

interface ProfilePhotoUploadProps {
  currentPhoto?: string;
  onPhotoUpdate?: (newPhotoUrl: string) => void;
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  currentPhoto = "default.jpg",
  onPhotoUpdate,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Subir archivo
      uploadPhoto(file);
    }
  };

  const uploadPhoto = async (file: File) => {
    setIsUploading(true);

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
        alert("Foto actualizada exitosamente!");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Error al subir la foto. Inténtalo de nuevo.");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getPhotoUrl = () => {
    if (previewUrl) return previewUrl;
    return `http://localhost:3000/img/users/${currentPhoto}`;
  };

  return (
    <div className="profile-photo-upload">
      <div
        className="photo-container"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <img
          src={getPhotoUrl()}
          alt="Profile"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #ddd",
            transition: "opacity 0.3s ease",
            opacity: isUploading ? 0.6 : 1,
          }}
        />
        {isUploading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#007bff",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            Subiendo...
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            backgroundColor: "#007bff",
            color: "white",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
          }}
        >
          📷
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        disabled={isUploading}
      />

      <p style={{ textAlign: "center", marginTop: "10px", color: "#666" }}>
        Haz clic en la foto para cambiarla
      </p>
    </div>
  );
};

export default ProfilePhotoUpload;
