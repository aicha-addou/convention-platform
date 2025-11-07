import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

export default function Conventions() {
  const [conventions, setConventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConventions = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || !user) {
          setError("Utilisateur non connecté");
          setLoading(false);
          return;
        }

        setRole(user.role);

        let dataConventions = [];
        let dataDrafts = [];

        if (user.role === "admin") {
          // 👑 L'admin récupère toutes les conventions
          const res = await fetch(
            "https://convention-platform.onrender.com/api/conventions",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Erreur serveur");
          dataConventions = data;
        } else if (user.role === "prestataire") {
          // 👷 Le prestataire récupère ses conventions officielles
          const res1 = await fetch(
            "https://convention-platform.onrender.com/api/conventions/mine",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data1 = await res1.json();
          if (!res1.ok) throw new Error(data1.message);
          dataConventions = data1;

          // 💾 Et ses brouillons
          const res2 = await fetch(
            "https://convention-platform.onrender.com/api/drafts",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data2 = await res2.json();
          if (!res2.ok) throw new Error(data2.message);

          // on ajoute une marque isDraft pour différencier
          dataDrafts = data2.map((d) => ({ ...d, isDraft: true }));
        } else if (user.role === "referent") {
          // (plus tard : conventions autorisées)
          const res = await fetch(
            "https://convention-platform.onrender.com/api/conventions",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data = await res.json();
          if (!res.ok) throw new Error(data.message);
          dataConventions = data;
        }

        // 🧩 Fusion : conventions officielles + brouillons
        setConventions([...dataConventions, ...dataDrafts]);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConventions();
  }, []);

  // 🌀 Chargement
  if (loading)
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64 text-gray-600">
          Chargement des conventions...
        </div>
      </AdminLayout>
    );

  // ❌ Erreur
  if (error)
    return (
      <AdminLayout>
        <div className="text-center text-red-600 font-medium mt-10">{error}</div>
      </AdminLayout>
    );

  // ✅ Liste fusionnée : conventions + brouillons
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {role === "admin"
            ? "📋 Toutes les Conventions"
            : role === "prestataire"
            ? "📄 Mes Conventions (et brouillons)"
            : "👀 Conventions autorisées"}
        </h2>

        {/* 🚀 Bouton "Nouvelle convention" visible uniquement pour les prestataires */}
        {role === "prestataire" && (
          <button
            onClick={() => navigate("/conventions/nouvelle")}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
          >
            ➕ Nouvelle convention
          </button>
        )}
      </div>

      {conventions.length === 0 ? (
        <p className="text-gray-500">Aucune convention trouvée.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-4 py-2">Numéro</th>
                <th className="px-4 py-2">Site</th>
                <th className="px-4 py-2">Début</th>
                <th className="px-4 py-2">Fin</th>
                <th className="px-4 py-2">Statut</th>
                <th className="px-4 py-2 text-center">Consulter</th>
              </tr>
            </thead>
            <tbody>
              {conventions.map((c) => (
                <tr
                  key={c._id}
                  className={`border-t hover:bg-gray-50 transition ${
                    c.isDraft ? "opacity-80" : ""
                  }`}
                >
                  <td className="px-4 py-2">{c.numero || "—"}</td>
                  <td className="px-4 py-2">{c.site || "—"}</td>
                  <td className="px-4 py-2">
                    {c.dateDebut
                      ? new Date(c.dateDebut).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-2">
                    {c.dateFin ? new Date(c.dateFin).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full font-medium ${
                        c.isDraft
                          ? "bg-gray-200 text-gray-700"
                          : c.statut === "brouillon"
                          ? "bg-gray-200 text-gray-700"
                          : c.statut === "en attente"
                          ? "bg-yellow-100 text-yellow-800"
                          : c.statut === "validée"
                          ? "bg-green-100 text-green-800"
                          : c.statut === "refusée"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {c.isDraft ? "Brouillon" : c.statut}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() =>
                        navigate(
                          c.isDraft
                            ? `/drafts/${c._id}/edit`
                            : `/conventions/${c._id}`
                        )
                      }
                      className="text-blue-700 hover:underline"
                    >
                      👁️ Consulter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
