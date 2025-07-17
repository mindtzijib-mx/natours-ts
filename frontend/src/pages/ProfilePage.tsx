import React, { useState, useEffect } from "react";
import ProfilePhotoUpload from "../components/ProfilePhotoUpload";

interface User {
  id: string;
  name: string;
  email: string;
  photo: string;
  role: string;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/v1/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener el perfil");
      }

      const data = await response.json();

      if (data.status === "success") {
        setUser(data.data.user);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpdate = (newPhotoUrl: string) => {
    if (user) {
      setUser({ ...user, photo: newPhotoUrl });
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p>Error al cargar el perfil</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Mi Perfil</h1>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <ProfilePhotoUpload
          currentPhoto={user.photo}
          onPhotoUpdate={handlePhotoUpdate}
        />
      </div>

      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>Información Personal</h3>

        <div style={{ marginBottom: "10px" }}>
          <strong>Nombre:</strong> {user.name}
        </div>

        <div style={{ marginBottom: "10px" }}>
          <strong>Email:</strong> {user.email}
        </div>

        <div style={{ marginBottom: "10px" }}>
          <strong>Rol:</strong> {user.role}
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
          onClick={() =>
            alert("Funcionalidad de editar perfil por implementar")
          }
        >
          Editar Perfil
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
