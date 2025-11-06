// src/components/Navbar.jsx
import React from "react";

export default function Navbar({ user }) {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-100 py-3 px-6 flex justify-between items-center">
      <h1 className="text-lg font-semibold text-gray-800">Plateforme VIGIK</h1>
      {user && (
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm font-medium">
            {user.role}
          </div>
          <p className="text-gray-700 font-semibold">{user.name}</p>
        </div>
      )}
    </header>
  );
}
