import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

export default function ConventionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [convention, setConvention] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentaire, setCommentaire] = useState("");

  useEffect(() => {
    const fetchConvention = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://convention-platform.onrender.com/api/conventions/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur lors du chargement");
        setConvention(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConvention();
  }, [id]);

  // 🔄 Validation / refus admin
  const handleAction = async (statut) => {
    if (!window.confirm(`Confirmer le changement de statut en "${statut}" ?`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://convention-platform.onrender.com/api/conventions/${id}/validation`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ statut, commentaireAdmin: commentaire }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert(data.message);
      setConvention(data.convention);
    } catch (err) {
      alert("❌ Erreur : " + err.message);
    }
  };

  // 🗑️ Suppression
  const handleDelete = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette convention ?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://convention-platform.onrender.com/api/conventions/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("✅ Convention supprimée !");
      navigate("/conventions");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <p className="text-gray-600">Chargement...</p>
      </AdminLayout>
    );

  if (error)
    return (
      <AdminLayout>
        <p className="text-red-600">{error}</p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-700">
          📄 Détails de la convention
        </h2>
        <button
          onClick={() => navigate("/conventions")}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          ← Retour à la liste
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-4 border border-gray-200">
        <p><strong>Numéro :</strong> {convention.numero}</p>
        <p><strong>Site :</strong> {convention.site}</p>
        <p><strong>Date de début :</strong> {new Date(convention.dateDebut).toLocaleDateString()}</p>
        <p><strong>Date de fin :</strong> {new Date(convention.dateFin).toLocaleDateString()}</p>
        <p>
          <strong>Statut :</strong>{" "}
          <span
            className={`px-3 py-1 rounded-full font-medium ${
              convention.statut === "brouillon"
                ? "bg-gray-200 text-gray-700"
                : convention.statut === "en attente"
                ? "bg-yellow-100 text-yellow-800"
                : convention.statut === "validée"
                ? "bg-green-100 text-green-800"
                : convention.statut === "refusée"
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {convention.statut}
          </span>
        </p>

        {convention.commentaireAdmin && (
          <p className="text-gray-700 italic">
            💬 Commentaire GRDF : {convention.commentaireAdmin}
          </p>
        )}
      </div>

      {/* Section admin d’action */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
        <h3 className="font-semibold text-gray-800 mb-2">Commentaire</h3>
        <textarea
          placeholder="Commentaire (facultatif)..."
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mb-3"
        />
        
      <div className="flex gap-3">
        <button
          onClick={() => handleAction("validée")}
          disabled={convention.statut !== "en attente"}
          className={`px-4 py-2 rounded text-white transition ${
            convention.statut === "en attente"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          ✅ Valider
        </button>

        <button
          onClick={() => handleAction("refusée")}
          disabled={convention.statut !== "en attente"}
          className={`px-4 py-2 rounded text-white transition ${
            convention.statut === "en attente"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          ❌ Refuser
        </button>

        <button
          onClick={handleDelete}
          className="ml-auto bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
        >
          🗑️ Supprimer
        </button>
      </div>









      </div>
    </AdminLayout>
  );
}
