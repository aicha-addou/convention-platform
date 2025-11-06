// src/pages/DashboardAdmin.jsx
import React from "react";
import AdminLayout from "../layouts/AdminLayout";

export default function DashboardAdmin() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <AdminLayout>
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800">
          Bienvenue <span className="text-blue-700">{user?.name}</span> 👑
        </h3>
        <p className="text-gray-600">
          Vous pouvez gérer les utilisateurs et consulter les rapports.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="text-sm text-gray-500">Utilisateurs</h4>
            <p className="text-3xl font-bold text-blue-700">12</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="text-sm text-gray-500">Conventions</h4>
            <p className="text-3xl font-bold text-yellow-500">5</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="text-sm text-gray-500">Rapports d'activité</h4>
            <p className="text-3xl font-bold text-green-600">3</p>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
