// src/layouts/ReferentLayout.jsx
import React from "react";
import BaseLayout from "./BaseLayout";
import Sidebar from "../components/Sidebar";

export default function ReferentLayout({ children }) {
  return <BaseLayout sidebar={Sidebar}>{children}</BaseLayout>;
}
