import React from "react";
import { useNavigate } from "react-router-dom";
import ConventionForm from "../components/ConventionForm";
import AdminLayout from "../layouts/AdminLayout";

export default function ConventionFormPage() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-700">
          ➕ Nouvelle Convention
        </h2>
        <button
          onClick={() => navigate("/conventions")}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          ← Retour à la liste
        </button>
      </div>

      {/* Formulaire de création */}
      <ConventionForm
        onSuccess={() => {
          alert("✅ Convention soumise à GRDF avec succès !");
          navigate("/conventions");
        }}
      />
    </AdminLayout>
  );
}
