// src/pages/Conventions.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";



export default function Conventions() {
  const [conventions, setConventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");

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

        // 🧠 Détermine la route selon le rôle
        let url = "";
        if (user.role === "admin") {
          url = "https://convention-platform.onrender.com/api/conventions";
        } else if (user.role === "prestataire") {
          url = "https://convention-platform.onrender.com/api/conventions/mine";
        } else if (user.role === "referent") {
          // plus tard tu feras /api/conventions/authorized
          url = "https://convention-platform.onrender.com/api/conventions";
        }

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur serveur");

        setConventions(data);
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

  // ✅ Liste des conventions
  return (
    <AdminLayout>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {role === "admin"
          ? "📋 Toutes les Conventions"
          : role === "prestataire"
          ? "📄 Mes Conventions"
          : "👀 Conventions autorisées"}
      </h2>

      {/* 🚀 Bouton "Nouvelle convention" visible uniquement pour les prestataires */}
      {role === "prestataire" && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => (window.location.href = "/conventions/nouvelle")}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
          >
            ➕ Nouvelle convention
          </button>
        </div>
      )}



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
                {role === "admin" && <th className="px-4 py-2 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {conventions.map((c) => (
                <tr key={c._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{c.numero}</td>
                  <td className="px-4 py-2">{c.site}</td>
                  <td className="px-4 py-2">{new Date(c.dateDebut).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{new Date(c.dateFin).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full font-medium ${
                        c.statut === "brouillon"
                          ? "bg-gray-200 text-gray-700"
                          : c.statut === "en attente"
                          ? "bg-yellow-100 text-yellow-800"
                          : c.statut === "validée"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {c.statut}
                    </span>
                  </td>

                  {/* 🧩 Boutons pour l'admin uniquement */}
                  {role === "admin" && (
                    <td className="px-4 py-2 flex justify-center gap-2">
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="text-red-600 hover:underline"
                      >
                        Supprimer
                      </button>
                      <button className="text-blue-700 hover:underline">Modifier</button>
                    </td>
                  )}

                  {role === "admin" && (
                    <td className="px-4 py-2 flex justify-center gap-2">
                      <button
                        onClick={() => handleValidation(c._id, "validée")}
                        className="text-green-600 hover:underline"
                      >
                        Valider
                      </button>
                      <button
                        onClick={() => handleValidation(c._id, "refusée")}
                        className="text-red-600 hover:underline"
                      >
                        Refuser
                      </button>
                    </td>
                  )}

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );

  // ⚙️ Suppression (admin uniquement)
  async function handleDelete(id) {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cette convention ?");
    if (!confirmDelete) return;

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
      setConventions(conventions.filter((c) => c._id !== id));
    } catch (err) {
      alert("❌ Erreur lors de la suppression : " + err.message);
    }
  }


  async function handleValidation(id, statut) {
  const commentaire = prompt(`Laissez un commentaire pour cette décision (${statut}) :`) || "";

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
    // Met à jour la liste sans recharger
    setConventions((prev) =>
      prev.map((c) => (c._id === id ? { ...c, statut, commentaireAdmin: commentaire } : c))
    );
  } catch (err) {
    alert("❌ Erreur : " + err.message);
  }
}


  


}
