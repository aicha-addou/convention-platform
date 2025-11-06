// src/pages/DashboardPrestataire.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrestataireLayout from "../layouts/PrestataireLayout";

export default function DashboardPrestataire() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Chargement...
      </div>
    );

  return (
    <PrestataireLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Topbar */}
        <nav className="flex justify-between items-center bg-white shadow-sm px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-blue-700">
            Espace Prestataire
          </h2>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm"
          >
            🚪 Déconnexion
          </button>
        </nav>

        {/* Contenu principal */}
        <main className="p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Bonjour <span className="text-blue-700">{user.name}</span> 👋
          </h3>
          <p className="text-gray-600 mb-8">
            Bienvenue dans votre espace personnel. Vous pouvez suivre vos conventions et documents ici.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="text-sm text-gray-500">Conventions en cours</h4>
              <p className="text-3xl font-bold text-blue-700">4</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="text-sm text-gray-500">Documents à signer</h4>
              <p className="text-3xl font-bold text-yellow-500">2</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="text-sm text-gray-500">Conventions terminées</h4>
              <p className="text-3xl font-bold text-green-600">6</p>
            </div>
          </div>
        </main>
      </div>
    </PrestataireLayout>
  );
}
