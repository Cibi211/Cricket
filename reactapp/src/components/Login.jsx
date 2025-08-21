import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; // to call backend API
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      // Replace with your backend API endpoint
      const response = await axios.post("http://localhost:8080/api/login", {
        email,
        password,
      });

      if (response.data.success) {
        setSuccess("Login successful!");
        // Store token/session if needed
        sessionStorage.setItem("neo_auth", JSON.stringify(response.data));
        navigate("/"); // redirect to home
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      setError("Error connecting to server");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <div className="auth-alert error">{error}</div>}
      {success && <div className="auth-alert success">{success}</div>}

      <form onSubmit={handleLogin} className="auth-form">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>

      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
