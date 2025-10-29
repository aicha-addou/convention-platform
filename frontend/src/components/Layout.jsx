import React from "react";
import "./Layout.css";

export default function Layout({ user, onLogout, children }) {
  return (
    <div className="layout">
      {/* 🧭 Barre de navigation en haut */}
      <header className="header">
        <div className="header-left">
          <h1>Convention Platform</h1>
        </div>
        <div className="header-right">
          <button className="nav-btn" onClick={() => (window.location.href = "/profile")}>
            👤 Profil
          </button>
          <button className="nav-btn logout" onClick={onLogout}>
            🚪 Déconnexion
          </button>
        </div>
      </header>

      {/* 🧱 Conteneur principal */}
      <div className="main-container">
        {/* 🚪 Barre latérale */}
        <aside className="sidebar">
          <ul>
            <li onClick={() => (window.location.href = "/dashboard")}>📊 Dashboard</li>
            {/* On ajoutera plus tard d’autres liens ici */}
          </ul>
        </aside>

        {/* 🧩 Contenu dynamique */}
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
