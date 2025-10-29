import React from "react";
import "./Dashboard.css";

export default function DashboardReferent({ user, handleLogout }) {
  return (
    <div className="dashboard-container">
      <h2>📋 Tableau de bord Référent</h2>
      <p>Bienvenue, <strong>{user.name}</strong> !</p>
      <p>Email : {user.email}</p>
      <p>
        Vous pouvez consulter les conventions qui vous ont été attribuées par l’administrateur.
      </p>

      <button className="btn logout" onClick={handleLogout}>
        Se déconnecter
      </button>
    </div>
  );
}