import React from "react";
import { Link } from "react-router-dom";
// import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">Neo Cricket</div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/addPlayer">Add Player</Link>
        <Link to="/viewPlayer">View Players</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </nav>
    </header>
  );
};

export default Header;
