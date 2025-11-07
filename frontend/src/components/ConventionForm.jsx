import React, { useState } from "react";

export default function ConventionForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    numero: "",
    site: "",
    dateDebut: "",
    dateFin: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await fetch("https://convention-platform.onrender.com/api/conventions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          prestataire: user._id,
          statut: "en attente",
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erreur de création");

      setMessage("✅ Convention envoyée à GRDF pour validation !");
      setFormData({ numero: "", site: "", dateDebut: "", dateFin: "" });
      onSuccess(data.convention); // ↩️ notification du parent
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3 text-blue-700">
        ➕ Créer une nouvelle convention
      </h3>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="numero"
          placeholder="Numéro de convention"
          value={formData.numero}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />

        <input
          type="text"
          name="site"
          placeholder="Site"
          value={formData.site}
          onChange={handleChange}
          required
          className="border rounded p-2"
        />

        <div>
          <label className="block text-sm text-gray-600 mb-1">Date de début</label>
          <input
            type="date"
            name="dateDebut"
            value={formData.dateDebut}
            onChange={handleChange}
            required
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
            required
            className="border rounded p-2 w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`col-span-2 py-2 rounded text-white transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-700 hover:bg-blue-800"
          }`}
        >
          {loading ? "Envoi en cours..." : "Envoyer la demande de convention"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-3 text-sm ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
