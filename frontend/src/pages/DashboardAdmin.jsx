import React from "react";
import Layout from "../components/Layout";
import "./Dashboard.css";

export default function DashboardAdmin({ user, handleLogout }) {
  return (
    <Layout user={user} onLogout={handleLogout}>
      <h2>👑 Tableau de bord Admin</h2>
      <p>Bienvenue, <strong>{user.name}</strong> !</p>
      <p>Email : {user.email}</p>

      <button
        className="btn primary"
        onClick={() => (window.location.href = "/users")}
      >
        👥 Gérer les utilisateurs
      </button>
    </Layout>
  );
}
