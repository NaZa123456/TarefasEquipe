import React from "react";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuth";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <AuthProvider>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </AuthProvider>
  );
}
