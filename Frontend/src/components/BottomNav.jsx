import React from "react";
import { Link } from "react-router-dom";
import "../styles/reels.css";

const BottomNav = ({ active }) => {
  return (
    <nav className="bottom-nav">
      <Link
        to="/"
        className={`nav-item ${active === "home" ? "nav-item-active" : ""}`}
      >
        <span className="nav-icon">⌂</span>
        <span className="nav-label">home</span>
      </Link>

      <Link
        to="/saved"
        className={`nav-item ${active === "saved" ? "nav-item-active" : ""}`}
      >
        <span className="nav-icon">🔖</span>
        <span className="nav-label">saved</span>
      </Link>

      <Link
        to="/user"
        className={`nav-item ${active === "user" ? "nav-item-active" : ""}`}
      >
        <span className="nav-icon">👤</span>
        <span className="nav-label">user</span>
      </Link>
    </nav>
  );
};

export default BottomNav;