import React from "react";

export default function Dashboard() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div>
      <h2>Bienvenue sur ton Dashboard 🎉</h2>
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>
  );
}
