import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Utilisateur non connecté");
          return;
        }

        const res = await fetch("https://convention-platform.onrender.com/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data);
        } else {
          setError(data.message || "Erreur lors de la récupération du profil");
        }
      } catch {
        setError("Impossible de contacter le serveur");
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button onClick={handleLogout}>Se reconnecter</button>
      </div>
    );
  }

  if (!user) return <p className="dashboard-loading">Chargement...</p>;

  return (
    <div className="dashboard-container">
      <h2>Bienvenue sur ton Dashboard 🎉</h2>
      <div className="dashboard-info">
        <p><strong>Nom :</strong> {user.name}</p>
        <p><strong>Email :</strong> {user.email}</p>
        <p><strong>Rôle :</strong> {user.role}</p>
      </div>

      {user.role === "admin" && (
        <button className="users-btn" onClick={() => navigate("/users")}>
          👥 Gérer les utilisateurs
        </button>
      )}

      <button className="logout-btn" onClick={handleLogout}>
        Se déconnecter
      </button>
    </div>
  );
}
