import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";

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

        const res = await fetch(
          "https://convention-platform.onrender.com/api/users",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
      } catch {
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
    <AdminLayout>
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          👥 Gestion des utilisateurs
        </h2>

        {/* Message d’erreur */}
        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded-md">
            {error}
          </div>
        )}

        {/* Filtres */}
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">
              Filtrer par rôle :
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-700 outline-none"
            >
              <option value="all">Tous</option>
              <option value="admin">Admin</option>
              <option value="referent">Référent</option>
              <option value="prestataire">Prestataire</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">
              Filtrer par statut :
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-700 outline-none"
            >
              <option value="all">Tous</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>
        </div>

        {/* Tableau des utilisateurs */}
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left py-3 px-4">Nom</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Rôle</th>
                <th className="text-left py-3 px-4">Statut</th>
                <th className="text-left py-3 px-4">Créé le</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4 capitalize">
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          user.role === "admin"
                            ? "bg-blue-700"
                            : user.role === "referent"
                            ? "bg-green-600"
                            : "bg-gray-500"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-white font-semibold ${
                          user.status === "actif"
                            ? "bg-green-600"
                            : "bg-red-500"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-6 text-center text-gray-500 italic"
                  >
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
