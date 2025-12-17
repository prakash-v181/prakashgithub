import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";
import "./auth.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      console.log("📤 Sending signup request:", {
        email,
        username,
        password,
      });

      const res = await api.post("/auth/register", {
        email,
        username,
        password,
      });

      console.log("✅ Signup response:", res.data);

      setSuccess("✅ Account created successfully!");
      setTimeout(() => navigate("/auth"), 1200);
    } catch (err) {
      console.error("❌ Signup error:", err);
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create your account</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button disabled={loading}>
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/auth">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;




// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../../api";
// import "./auth.css";

// const Signup = () => {
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const navigate = useNavigate();

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setLoading(true);

//     try {
//       console.log("📤 Sending signup request:", {
//         email,
//         username,
//         password,
//       });

//       await api.post("/auth/register", {
//         email,
//         username,
//         password,
//       });

//       // ✅ SUCCESS (no token expected here)
//       setSuccess("✅ Account created successfully! Redirecting to login...");

//       setTimeout(() => {
//         navigate("/auth");
//       }, 1500);
//     } catch (err) {
//       console.error("❌ Signup error:", err);

//       if (err.response?.status === 400) {
//         setError(err.response.data?.message || "Signup failed");
//       } else if (err.response?.status === 500) {
//         setError("Server error. Please try again later.");
//       } else {
//         setError("Signup failed. Check your connection.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <div className="auth-header">
//           <h2>Create your account</h2>
//           <p>Join our GitHub-like platform</p>
//         </div>

//         {error && <div className="error-message">⚠️ {error}</div>}
//         {success && <div className="success-message">{success}</div>}

//         <form onSubmit={handleSignup}>
//           <div className="form-group">
//             <label>Email address</label>
//             <input
//               type="email"
//               placeholder="you@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               disabled={loading}
//             />
//           </div>

//           <div className="form-group">
//             <label>Username</label>
//             <input
//               type="text"
//               placeholder="octocat"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//               disabled={loading}
//             />
//           </div>

//           <div className="form-group">
//             <label>Password</label>
//             <input
//               type="password"
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               disabled={loading}
//             />
//           </div>

//           <button type="submit" disabled={loading} className="submit-btn">
//             {loading ? "Creating account..." : "Sign up"}
//           </button>
//         </form>

//         <div className="auth-footer">
//           <p>
//             Already have an account? <Link to="/auth">Sign in</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;




// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../../authContext";

// import { PageHeader } from "@primer/react/drafts";
// import { Box, Button } from "@primer/react";
// import "./auth.css";

// import logo from "../../assets/github-mark-white.svg";
// import { Link } from "react-router-dom";

// const Signup = () => {
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const { setCurrentUser } = useAuth();

//   const handleSignup = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);
      // const res = await axios.post("https://backendgithub-uz08.onrender.com", {
//         email: email,
//         password: password,
//         username: username,
//       });

//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("userId", res.data.userId);

//       setCurrentUser(res.data.userId);
//       setLoading(false);

//       window.location.href = "/";
//     } catch (err) {
//       console.error(err);
//       alert("Signup Failed!");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-wrapper">
//       <div className="login-logo-container">
//         <img className="logo-login" src={logo} alt="Logo" />
//       </div>

//       <div className="login-box-wrapper">
//         <div className="login-heading">
//           <Box sx={{ padding: 1 }}>
//             <PageHeader>
//               <PageHeader.TitleArea variant="large">
//                 <PageHeader.Title>Sign Up</PageHeader.Title>
//               </PageHeader.TitleArea>
//             </PageHeader>
//           </Box>
//         </div>

//         <div className="login-box">
//           <div>
//             <label className="label">Username</label>
//             <input
//               autoComplete="off"
//               name="Username"
//               id="Username"
//               className="input"
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="label">Email address</label>
//             <input
//               autoComplete="off"
//               name="Email"
//               id="Email"
//               className="input"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <div className="div">
//             <label className="label">Password</label>
//             <input
//               autoComplete="off"
//               name="Password"
//               id="Password"
//               className="input"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           <Button
//             variant="primary"
//             className="login-btn"
//             disabled={loading}
//             onClick={handleSignup}
//           >
//             {loading ? "Loading..." : "Signup"}
//           </Button>
//         </div>

//         <div className="pass-box">
//           <p>
//             Already have an account? <Link to="/auth">Login</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;
