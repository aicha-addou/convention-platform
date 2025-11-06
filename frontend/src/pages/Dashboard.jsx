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
          // 💾 Sauvegarde le user localement (utile pour ProtectedRoute)
          localStorage.setItem("user", JSON.stringify(data));
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
    localStorage.removeItem("user");
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
      <nav className="dashboard-topbar">
        <h2>VIGIK Platform</h2>
        <div className="dashboard-nav-actions">
          <button onClick={() => navigate("/profile")}>👤 Profil</button>
          <button onClick={handleLogout}>🚪 Déconnexion</button>
        </div>
      </nav>

      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <button onClick={() => navigate("/dashboard")}>🏠 Tableau de bord</button>
          {user.role === "admin" && (
            <button onClick={() => navigate("/users")}>👥 Gérer les utilisateurs</button>
          )}
        </aside>

        <main className="dashboard-content">
          <h3>Bienvenue {user.name} 🎉</h3>
          <p><strong>Email :</strong> {user.email}</p>
          <p><strong>Rôle :</strong> {user.role}</p>
          <p><strong>Statut :</strong> {user.status}</p>
        </main>
      </div>
    </div>
  );
}
