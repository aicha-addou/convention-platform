import React, { useState } from "react";
import { loginUser } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await loginUser({ email, password });

    if (data.token) {
      // ✅ Sauvegarde du token JWT
      localStorage.setItem("token", data.token);

      setMessage("Connexion réussie !");
      // 👉 redirection vers le dashboard
      window.location.href = "/dashboard";
    } else {
      setMessage(data.message || "Erreur de connexion");
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Se connecter</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
