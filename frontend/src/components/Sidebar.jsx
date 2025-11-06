// src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // 🧭 Définition des liens selon le rôle
  const getLinksByRole = () => {
    if (!user) return [];

    switch (user.role) {
      case "admin":
        return [
          { path: "/admin/dashboard", label: "Tableau de bord", icon: "🏠" },
          { path: "/admin/conventions", label: "Conventions", icon: "📄" },
          { path: "/admin/reports", label: "Rapports d’activité", icon: "📊" },
          { path: "/admin/users", label: "Utilisateurs", icon: "👥" },
          { path: "/admin/settings", label: "Paramètres", icon: "⚙️" },
        ];
      case "referent":
        return [
          { path: "/referent/dashboard", label: "Tableau de bord", icon: "🏠" },
          { path: "/referent/conventions", label: "Conventions", icon: "📄" },
          { path: "/referent/reports", label: "Rapports d’activité", icon: "📊" },
        ];
      case "prestataire":
        return [
          { path: "/prestataire/dashboard", label: "Tableau de bord", icon: "🏠" },
          { path: "/prestataire/conventions", label: "Mes Conventions", icon: "📄" },
          { path: "/prestataire/reports", label: "Rapports", icon: "📊" },
        ];
      default:
        return [];
    }
  };

  const links = getLinksByRole();

  return (
    <>
      {/* Bouton burger mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-700 text-white shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar principale */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full lg:h-screen w-64 bg-white border-r border-gray-200 shadow-sm 
          flex flex-col justify-between transform transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-center border-b border-gray-100">
          <img src="/grdf-logo.png" alt="GRDF" className="w-28" />
        </div>

        {/* Liens de navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {links.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors duration-200 
                ${
                  location.pathname === link.path
                    ? "bg-blue-700 text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="text-sm lg:text-base">{link.label}</span>
            </button>
          ))}
        </nav>

        {/* Bouton de déconnexion */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
            className="flex items-center gap-2 w-full text-red-600 font-medium hover:text-red-700 transition"
          >
            🚪 Se déconnecter
          </button>
        </div>
      </aside>
    </>
  );
}
