// src/pages/Settings.jsx
import React from "react";
import AdminLayout from "../layouts/AdminLayout";

export default function Settings() {
  return (
    <AdminLayout>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Paramètres
      </h2>
      <p className="text-gray-600">
        Options de configuration de la plateforme.
      </p>
    </AdminLayout>
  );
}
