import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user"); // si tu veux stocker les infos user localement
  const user = userData ? JSON.parse(userData) : null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 Vérifie que le rôle est autorisé
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
     // Si l’utilisateur n’a pas le rôle requis, on le renvoie à sa page
    if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === "referent") return <Navigate to="/referent/dashboard" replace />;
    if (user?.role === "prestataire") return <Navigate to="/prestataire/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
}
