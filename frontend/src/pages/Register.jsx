import React, { useState } from "react";
import { registerUser } from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "", // valeur par défaut pour éviter un champ vide
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await registerUser(form);
      if (data.user) {
        setMessage("✅ Utilisateur créé avec succès !");
        // 👉 Option : connexion automatique après inscription
        // localStorage.setItem("token", data.token);
        // window.location.href = "/dashboard";
      } else {
        setMessage(data.message || "Erreur lors de l'inscription");
      }
    } catch {
      setMessage("Erreur serveur, réessaye plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <h2>Créer un compte</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nom complet"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="prestataire">Prestataire</option>
          <option value="referent">Référent</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Création en cours..." : "S'inscrire"}
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
}

