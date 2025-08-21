import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div>© {new Date().getFullYear()} Cricket Tournament Registration App</div>
    </footer>
  );
};

export default Footer;
