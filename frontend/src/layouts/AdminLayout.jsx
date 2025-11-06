// src/layouts/AdminLayout.jsx
import React from "react";
import BaseLayout from "./BaseLayout";
import Sidebar from "../components/Sidebar";

export default function AdminLayout({ children }) {
  return <BaseLayout sidebar={Sidebar}>{children}</BaseLayout>;
}
