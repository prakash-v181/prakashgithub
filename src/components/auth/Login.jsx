import React, { useState } from "react";
import { useAuth } from "../../authContext";

import { PageHeader } from "@primer/react/drafts";
import { Box, Button } from "@primer/react";
import "./auth.css";

import logo from "../../assets/github-mark-white.svg";
import { Link } from "react-router-dom";


// ✅ USE CENTRAL API CONFIG (IMPORTANT)
import api from "../../config/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setCurrentUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ✅ CORRECT API CALL (NO HARDCODED URL)
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);
      setLoading(false);

      window.location.href = "/";
    } catch (error) {
      console.error("Login error:", error);
      alert("Login Failed!");
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Logo */}
      <div className="login-logo-container">
        <img src={logo} alt="GitHub Logo" className="logo-login" />
      </div>

      {/* Login Box */}
      <div className="login-box-wrapper">
        <Box sx={{ padding: 2 }}>
          <PageHeader>
            <PageHeader.TitleArea variant="large">
              <PageHeader.Title>Sign in to GitHub</PageHeader.Title>
            </PageHeader.TitleArea>
          </PageHeader>
        </Box>

        <form className="login-box" onSubmit={handleLogin}>
          <div>
            <label className="label">Email address</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            variant="primary"
            className="login-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="pass-box">
          <p>
            New to GitHub? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
