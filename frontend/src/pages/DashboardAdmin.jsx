import React from "react";
import Layout from "../components/Layout";
import SidebarAdmin from "../components/SidebarAdmin";

export default function DashboardAdmin({ user }) {
  return (
    <Layout user={user} sidebar={SidebarAdmin}>
      <h3>Bienvenue {user.name} 👑</h3>
      <p>Vous pouvez gérer les utilisateurs et consulter les rapports.</p>
    </Layout>
  );
}
