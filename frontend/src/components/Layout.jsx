// src/components/Layout.jsx
import React from "react";
import Navbar from "./Navbar";

export default function Layout({ user, sidebar: Sidebar, children }) {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Barre du haut */}
      <Navbar user={user} />

      {/* Corps principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (responsive, gérée par le composant lui-même) */}
        <Sidebar />

        {/* Contenu principal */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
