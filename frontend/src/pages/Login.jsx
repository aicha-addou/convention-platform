import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await loginUser({ email, password });

      if (data.token && data.user) {
        // ✅ Sauvegarde du token et des infos utilisateur
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ Redirection selon le rôle
        const role = data.user.role;
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "referent") {
          navigate("/referent/dashboard");
        } else if (role === "prestataire") {
          navigate("/prestataire/dashboard");
        } else {
          // rôle inconnu : sécurité
          navigate("/login");
        }

        setMessage("Connexion réussie !");
      } else {
        setPassword("");
        setMessage(data.message || "Erreur de connexion");
      }
    } catch {
      setMessage("Erreur serveur. Réessaie plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* Conteneur principal */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm space-y-5">
        <h2 className="text-2xl font-semibold text-blue-700 text-center">
          Connexion
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Champ email */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Adresse email
            </label>
            <input
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-700 outline-none"
            />
          </div>

          {/* Champ mot de passe */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-700 outline-none"
            />
          </div>

          {/* Lien mot de passe oublié */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => alert("Fonctionnalité à venir 😉")}
              className="text-sm text-blue-700 hover:underline"
            >
              Mot de passe oublié ?
            </button>
          </div>

          {/* Bouton de connexion */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-700 hover:bg-blue-800"
            }`}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Message d’erreur ou succès */}
        {message && (
          <p
            className={`text-sm text-center mt-2 ${
              message.includes("réussie")
                ? "text-green-600"
                : "text-red-600 font-medium"
            }`}
          >
            {message}
          </p>
        )}

        {/* Lien vers inscription */}
        <p className="text-gray-600 text-sm text-center mt-4">
          Pas encore de compte ?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-700 font-semibold hover:underline"
          >
            S’inscrire
          </button>
        </p>
      </div>
    </div>
  );
}
