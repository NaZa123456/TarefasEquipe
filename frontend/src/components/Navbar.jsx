import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path) ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">TaskFlow</Link>
      </div>
      <div className="navbar-links">
        <Link to="/dashboard" className={isActive("/dashboard")}>Dashboard</Link>
        <Link to="/teams" className={isActive("/teams")}>Teams</Link>
        <Link to="/profile" className={isActive("/profile")}>Profile</Link>
      </div>
      <div className="navbar-user">
        <span className="navbar-user-name">{user?.name}</span>
        <button onClick={logout} className="btn btn-sm btn-outline">Logout</button>
      </div>
    </nav>
  );
}
