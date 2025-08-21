import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="brand">Neo Cricket Tournament Registration</div>
      <nav className="topnav">
        <button className="nav-link" onClick={() => navigate("/")}>Home</button>
        <button className="nav-link" onClick={() => navigate("/viewplayer")}>Players</button>
        <button className="nav-link" onClick={() => navigate("/addPlayer")}>Register</button>
      </nav>
    </header>
  );
};

export default Header;
