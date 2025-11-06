// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">
        Bienvenue sur la Plateforme VIGIK
      </h1>

      <button
        onClick={() => navigate("/login")}
        className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition shadow-md"
      >
        Connexion
      </button>
    </div>
  );
}
