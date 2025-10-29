import React from "react";
import "./Dashboard.css";

export default function DashboardPrestataire({ user, handleLogout }) {
  return (
    <div className="dashboard-container">
      <h2>🧰 Tableau de bord Prestataire</h2>
      <p>Bienvenue, <strong>{user.name}</strong> !</p>
      <p>Email : {user.email}</p>
      <p>Vous pouvez gérer vos informations et suivre vos conventions assignées.</p>

      <button className="btn logout" onClick={handleLogout}>
        Se déconnecter
      </button>
    </div>
  );
}
