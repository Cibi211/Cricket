import React from "react";
import { useNavigate } from "react-router-dom";
import cricketImg from "../assets/background.jpg"; // ✅ Import your local asset
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="home"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${cricketImg})`, // ✅ Use imported asset
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* soft overlay so text is readable */}
      <div className="home-overlay" />

      <header className="home-topbar">
        <div className="brand">Neo Cricket Tournament Registration</div>
        <nav className="topnav">
          <button className="nav-link" onClick={() => navigate("/")}>Home</button>
          <button className="nav-link" onClick={() => navigate("/viewplayer")}>Players</button>
          <button className="nav-link" onClick={() => navigate("/addPlayer")}>Register</button>
        </nav>
      </header>

      <main className="hero">
        <div className="hero-card">
          <div className="hero-left">
            <h1 className="hero-title">Welcome to Cricket Tournament Registration</h1>
            <p className="hero-sub">
              Quick, fair and simple registration for players — manage squads, schedule matches and track performance. Join the league today!
            </p>

            <div className="hero-ctas">
              <button className="btn btn-primary" onClick={() => navigate("/addPlayer")}>
                Register Player
              </button>
              <button className="btn btn-ghost" onClick={() => navigate("/viewplayer")}>
                View Players
              </button>
            </div>

            
          </div>

          <div className="hero-right">
            <div className="ornament">
              {/* cricket ball SVG ornament */}
              <svg className="cricket-ball" viewBox="0 0 64 64" width="160" height="160" aria-hidden>
                <circle cx="32" cy="32" r="30" fill="#fff" />
                <circle cx="32" cy="32" r="28" fill="#8b5cf6" opacity="0.12" />
                <path d="M18 20c6 4 10 6 16 6s10-2 16-6" stroke="#8b5cf6" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d="M18 44c6-4 10-6 16-6s10 2 16 6" stroke="#8b4cff" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <g stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M22 14 L26 22" />
                  <path d="M42 14 L38 22" />
                  <path d="M22 50 L26 42" />
                  <path d="M42 50 L38 42" />
                </g>
              </svg>
            </div>

            <div className="stats">
              <div className="stat">
                <div className="stat-value">1.2k+</div>
                <div className="stat-label">Players</div>
              </div>
              <div className="stat">
                <div className="stat-value">120</div>
                <div className="stat-label">Matches</div>
              </div>
              <div className="stat">
                <div className="stat-value">24</div>
                <div className="stat-label">Teams</div>
              </div>
            </div>
          </div>
        </div>

        <div className="pulsing-shape" aria-hidden />
      </main>

      <footer className="home-footer">
        <div>© {new Date().getFullYear()} Cricket Tournament Registration App</div>
      </footer>
    </div>
  );
};

export default Home;
