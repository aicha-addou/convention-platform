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

  // 🔧 Fonction générique (enregistrement ou soumission)
  const handleSubmit = async (statut) => {
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      // ⚠️ Si soumission, on vérifie les champs requis
      if (statut === "en attente") {
        const { numero, site, dateDebut, dateFin } = formData;
        if (!numero || !site || !dateDebut || !dateFin) {
          setMessage("⚠️ Tous les champs doivent être remplis avant la soumission.");
          setLoading(false);
          return;
        }
      }

      const res = await fetch("https://convention-platform.onrender.com/api/conventions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          prestataire: user._id,
          statut, // 💾 "brouillon" ou 📤 "en attente"
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors de la création");

      setMessage(
        statut === "brouillon"
          ? "💾 Brouillon enregistré (vous pourrez le compléter plus tard)."
          : "✅ Convention envoyée à GRDF pour validation !"
      );

      if (statut === "en attente") onSuccess(data.convention);

      if (statut === "en attente") {
        setFormData({ numero: "", site: "", dateDebut: "", dateFin: "" });
      }
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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit("en attente");
        }}
        className="grid grid-cols-2 gap-4"
      >
        <input
          type="text"
          name="numero"
          placeholder="Numéro de convention"
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

        {/* 🔘 Boutons d’action */}
        <div className="col-span-2 flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={() => handleSubmit("brouillon")}
            disabled={loading}
            className={`px-4 py-2 rounded text-gray-800 bg-gray-200 hover:bg-gray-300 transition ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
          >
            💾 Enregistrer le brouillon
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded text-white transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800"
            }`}
          >
            {loading ? "Envoi..." : "📤 Soumettre à GRDF"}
          </button>
        </div>
      </form>

      {message && (
        <p
          className={`mt-3 text-sm ${
            message.startsWith("✅") || message.startsWith("💾")
              ? "text-green-600"
              : message.startsWith("⚠️")
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
