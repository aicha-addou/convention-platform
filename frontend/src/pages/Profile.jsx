// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("❌ Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const res = await fetch(
        "https://convention-platform.onrender.com/api/users/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Mot de passe modifié avec succès !");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage(data.message || "Erreur lors du changement de mot de passe.");
      }
    } catch {
      setMessage("❌ Erreur serveur. Réessaie plus tard.");
    }
  };

  if (!user)
    return (
      <AdminLayout>
        <p className="text-gray-600">Chargement...</p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">👤 Mon profil</h2>

      <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-xl">
        <div>
          <p>
            <strong>Nom :</strong> {user.name}
          </p>
          <p>
            <strong>Email :</strong> {user.email}
          </p>
          <p>
            <strong>Rôle :</strong>{" "}
            <span
              className={`px-2 py-1 rounded text-white ${
                user.role === "admin"
                  ? "bg-blue-700"
                  : user.role === "referent"
                  ? "bg-green-600"
                  : "bg-gray-600"
              }`}
            >
              {user.role}
            </span>
          </p>
        </div>

        <hr className="my-4" />

        <h3 className="text-lg font-semibold text-gray-700">
          🔒 Changer mon mot de passe
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-3">
          <input
            type="password"
            placeholder="Mot de passe actuel"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-700 outline-none"
          />
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-700 outline-none"
          />
          <input
            type="password"
            placeholder="Confirmer le nouveau mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-700 outline-none"
          />
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition"
          >
            Modifier le mot de passe
          </button>
        </form>

        {message && (
          <p
            className={`text-sm mt-2 ${
              message.includes("✅")
                ? "text-green-600"
                : "text-red-600 font-medium"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </AdminLayout>
  );
}
