import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

export default function Drafts() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://convention-platform.onrender.com/api/drafts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur serveur");

        setDrafts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  // 📤 Soumettre un brouillon à GRDF
  const handleSubmit = async (id) => {
    if (!window.confirm("Soumettre ce brouillon à GRDF ?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://convention-platform.onrender.com/api/drafts/${id}/submit`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("✅ Convention soumise à GRDF !");
      setDrafts(drafts.filter((d) => d._id !== id)); // retire le brouillon soumis
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  // 🗑️ Supprimer un brouillon
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce brouillon ?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://convention-platform.onrender.com/api/drafts/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDrafts(drafts.filter((d) => d._id !== id));
      alert("🗑️ Brouillon supprimé.");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64 text-gray-600">
          Chargement des brouillons...
        </div>
      </AdminLayout>
    );

  if (error)
    return (
      <AdminLayout>
        <div className="text-center text-red-600 font-medium mt-10">{error}</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-700">💾 Mes brouillons</h2>
        <button
          onClick={() => navigate("/conventions/nouvelle")}
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
        >
          ➕ Nouveau brouillon
        </button>
      </div>

      {drafts.length === 0 ? (
        <p className="text-gray-500">Aucun brouillon enregistré.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-4 py-2">Numéro</th>
                <th className="px-4 py-2">Site</th>
                <th className="px-4 py-2">Début</th>
                <th className="px-4 py-2">Fin</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drafts.map((d) => (
                <tr key={d._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{d.numero || "—"}</td>
                  <td className="px-4 py-2">{d.site || "—"}</td>
                  <td className="px-4 py-2">
                    {d.dateDebut ? new Date(d.dateDebut).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-2">
                    {d.dateFin ? new Date(d.dateFin).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-2 text-center flex justify-center gap-2">
                    <button
                      onClick={() => navigate(`/drafts/${d._id}/edit`)}
                      className="text-blue-700 hover:underline"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => handleSubmit(d._id)}
                      className="text-green-600 hover:underline"
                    >
                      📤 Soumettre
                    </button>
                    <button
                      onClick={() => handleDelete(d._id)}
                      className="text-red-600 hover:underline"
                    >
                      🗑️ Supprimer
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
