import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

export default function DraftEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    numero: "",
    site: "",
    dateDebut: "",
    dateFin: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://convention-platform.onrender.com/api/drafts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setFormData({
          numero: data.numero || "",
          site: data.site || "",
          dateDebut: data.dateDebut ? data.dateDebut.split("T")[0] : "",
          dateFin: data.dateFin ? data.dateFin.split("T")[0] : "",
        });
      } catch (err) {
        setMessage("❌ " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDraft();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://convention-platform.onrender.com/api/drafts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("💾 Brouillon mis à jour !");
      navigate("/drafts");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <p>Chargement du brouillon...</p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-700">✏️ Modifier un brouillon</h2>
        <button
          onClick={() => navigate("/drafts")}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          ← Retour
        </button>
      </div>

      <form className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="numero"
          placeholder="Numéro"
          value={formData.numero}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <input
          type="text"
          name="site"
          placeholder="Site"
          value={formData.site}
          onChange={handleChange}
          className="border rounded p-2"
        />
        <div>
          <label className="block text-sm text-gray-600 mb-1">Date de début</label>
          <input
            type="date"
            name="dateDebut"
            value={formData.dateDebut}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Date de fin</label>
          <input
            type="date"
            name="dateFin"
            value={formData.dateFin}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>
      </form>

      <div className="flex justify-end mt-4 gap-3">
        <button
          onClick={handleSave}
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          💾 Enregistrer
        </button>
      </div>

      {message && <p className="mt-4 text-red-600">{message}</p>}
    </AdminLayout>
  );
}
