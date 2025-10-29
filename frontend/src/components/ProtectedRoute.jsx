import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ⚠️ Si pas de token, rediriger vers /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si un rôle spécifique est requis
  if (role && user && !role.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Sinon, afficher la page demandée
  return children;
}
