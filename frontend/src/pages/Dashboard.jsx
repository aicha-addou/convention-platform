import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Utilisateur non connecté");
          return;
        }

        const res = await fetch("https://convention-platform.onrender.com/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data);
        } else {
          setError(data.message || "Erreur lors de la récupération du profil");
        }
      } catch {
        setError("Impossible de contacter le serveur");
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (error) {
    return (
      <div>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={handleLogout}>Se reconnecter</button>
      </div>
    );
  }

  if (!user) return <p>Chargement...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Bienvenue sur ton Dashboard 🎉</h2>
      <p><strong>Nom :</strong> {user.name}</p>
      <p><strong>Email :</strong> {user.email}</p>
      <p><strong>Rôle :</strong> {user.role}</p>
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>
  );
}
