import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";
import api from "../../api";
import "./auth.css";

const Login = () => {
  const { setCurrentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Clear old session on login page load
  useEffect(() => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  }, [setCurrentUser]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("📤 Sending login request:", { email, password });

      // 1️⃣ Login
      const loginRes = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("✅ Login response:", loginRes.data);

      const token = loginRes.data?.token;
      if (!token) {
        throw new Error("Token missing in response");
      }

      // 2️⃣ Save token
      localStorage.setItem("token", token);
      console.log("💾 Token saved");

      // 3️⃣ Fetch current user
      console.log("📡 Fetching user info...");
      const meRes = await api.get("/auth/me");
      console.log("✅ User info:", meRes.data);

      // 4️⃣ Save user & redirect
      setCurrentUser(meRes.data);
      navigate("/");
    } catch (err) {
      console.error("❌ Login error:", err);

      if (err.response?.status === 400) {
        setError(err.response.data?.message || "Invalid email or password");
      } else if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome back</h2>
          <p>Sign in to your GitHub-like account</p>
        </div>

        {error && <div className="error-message">⚠️ {error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="test@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            New to GitHub-like? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
