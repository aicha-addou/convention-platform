// src/layouts/BaseLayout.jsx
import React from "react";

export default function BaseLayout({ sidebar: Sidebar, children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      {/* Sidebar si présente */}
      {Sidebar && <Sidebar />}

      {/* Contenu principal */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
