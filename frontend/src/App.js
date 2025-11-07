// src/App.js
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

// 🧩 Pages communes Admin / Référent / Prestataire
import Conventions from "./pages/Conventions";
import ConventionFormPage from "./pages/ConventionFormPage";
import ConventionDetails from "./pages/ConventionDetails";

import Drafts from "./pages/Drafts";
import DraftEditPage from "./pages/DraftEditPage";



import Reports from "./pages/Reports";

// 🧩 Pages spécifiques Admin
import DashboardAdmin from "./pages/DashboardAdmin";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

// 🧩 Pages spécifiques Référent
import DashboardReferent from "./pages/DashboardReferent";

// 🧩 Pages spécifiques Prestataire
import DashboardPrestataire from "./pages/DashboardPrestataire";

function App() {
  return (
    <Routes>
      {/* 🌐 ROUTES PUBLIQUES */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 🏛️ ESPACE ADMIN */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/conventions"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Conventions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* 🧭 ESPACE RÉFÉRENT */}
      <Route
        path="/referent/dashboard"
        element={
          <ProtectedRoute allowedRoles={["referent"]}>
            <DashboardReferent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/referent/conventions"
        element={
          <ProtectedRoute allowedRoles={["referent"]}>
            <Conventions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/referent/reports"
        element={
          <ProtectedRoute allowedRoles={["referent"]}>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* 🧰 ESPACE PRESTATAIRE */}
      <Route
        path="/prestataire/dashboard"
        element={
          <ProtectedRoute allowedRoles={["prestataire"]}>
            <DashboardPrestataire />
          </ProtectedRoute>
        }
      />
      <Route
        path="/prestataire/conventions"
        element={
          <ProtectedRoute allowedRoles={["prestataire"]}>
            <Conventions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/prestataire/reports"
        element={
          <ProtectedRoute allowedRoles={["prestataire"]}>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* 🔒 Page profil (commune à tous les rôles) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["admin", "referent", "prestataire"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/conventions"
        element={
          <ProtectedRoute allowedRoles={["admin", "prestataire"]}>
            <Conventions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/conventions/nouvelle"
        element={
          <ProtectedRoute allowedRoles={["prestataire"]}>
            <ConventionFormPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/conventions/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ConventionDetails />
          </ProtectedRoute>
         }
      />
      
      <Route
        path="/drafts"
        element={
          <ProtectedRoute allowedRoles={["prestataire"]}>
            <Drafts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/drafts/:id/edit"
        element={
          <ProtectedRoute allowedRoles={["prestataire"]}>
            <DraftEditPage />
          </ProtectedRoute>
        }
      />



    </Routes>


  );
}

export default App;
