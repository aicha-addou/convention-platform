import React, { useEffect, useState } from "react";
import DashboardAdmin from "./DashboardAdmin";
import DashboardReferent from "./DashboardReferent.jsx";
import DashboardPrestataire from "./DashboardPrestataire";
import "./Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

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
    window.location.href = "/login";
  };

  if (error) {
    return (
      <div className="dashboard-container">
        <p className="error-text">{error}</p>
        <button className="btn logout" onClick={handleLogout}>
          Se reconnecter
        </button>
      </div>
    );
  }

  if (!user) return <p className="loading-text">Chargement...</p>;

  // 🧭 Redirection automatique selon le rôle
  switch (user.role) {
    case "admin":
      return <DashboardAdmin user={user} handleLogout={handleLogout} />;
    case "referent":
      return <DashboardReferent user={user} handleLogout={handleLogout} />;
    case "prestataire":
      return <DashboardPrestataire user={user} handleLogout={handleLogout} />;
    default:
      return (
        <div className="dashboard-container">
          <p>Rôle inconnu. Contacte un administrateur.</p>
          <button className="btn logout" onClick={handleLogout}>
            Se déconnecter
          </button>
        </div>
      );
  }
}
