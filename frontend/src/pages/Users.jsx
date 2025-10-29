import React, { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!token) {
          setError("Vous devez être connecté pour accéder à cette page.");
          return;
        }

        const res = await fetch("https://convention-platform.onrender.com/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // 🧱 Si la réponse n’est pas ok
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            setError("Accès refusé. Vous n’êtes pas autorisé à consulter cette page.");
          } else {
            setError("Erreur lors du chargement des utilisateurs.");
          }
          return;
        }

        const data = await res.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch{
        
        setError("Impossible de contacter le serveur.");
      }
    };
    fetchUsers();
  }, [token]);

  // 🔎 Filtrage dynamique par rôle / statut
  useEffect(() => {
    let result = [...users];
    if (filterRole !== "all") result = result.filter((u) => u.role === filterRole);
    if (filterStatus !== "all") result = result.filter((u) => u.status === filterStatus);
    setFilteredUsers(result);
  }, [filterRole, filterStatus, users]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>👥 Gestion des utilisateurs</h2>

      {/* Filtres */}
      <div style={{ marginBottom: "1rem" }}>
        <label>Filtrer par rôle : </label>
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="all">Tous</option>
          <option value="admin">Admin</option>
          <option value="referent">Référent</option>
          <option value="prestataire">Prestataire</option>
        </select>

        <label style={{ marginLeft: "1rem" }}>Filtrer par statut : </label>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">Tous</option>
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>
      </div>

      {/* Tableau des utilisateurs */}
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: "#f2f2f2" }}>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Statut</th>
            <th>Créé le</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td
                  style={{
                    color: user.status === "actif" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {user.status}
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Aucun utilisateur trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
