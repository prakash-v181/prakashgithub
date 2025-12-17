import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import api from "../../api";
import { useAuth } from "../../authContext";
import { useNavigate } from "react-router-dom";
import "./profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/auth/me");
      setUser(response.data);
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/login"); // ✅ FIXED
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="profile-container">
          <div className="profile-loading">Loading profile...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="profile-container">
          <div className="profile-error">⚠️ {error}</div>
        </div>
      </>
    );
  }

  const avatarLetter =
    user?.username?.charAt(0)?.toUpperCase() || "U";

  return (
    <>
      <Navbar />

      <div className="profile-container">
        {/* ================= HEADER ================= */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.username} />
            ) : (
              <div className="avatar-placeholder">{avatarLetter}</div>
            )}
          </div>

          <div className="profile-info">
            <h1>{user?.username}</h1>
            <p className="profile-email">{user?.email}</p>

            {user?.bio && <p className="profile-bio">{user.bio}</p>}

            {/* ✅ PUBLIC PROFILE LINK */}
            <a
              href="https://prakash-v181.github.io/github.io-my-github-profile-pr/"
              target="_blank"
              rel="noopener noreferrer"
              className="profile-link"
            >
              🔗 View Public Profile
            </a>

            {/* ================= STATS ================= */}
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">
                  {user?.followers?.length || 0}
                </span>
                <span className="stat-label">Followers</span>
              </div>

              <div className="stat-item">
                <span className="stat-value">
                  {user?.following?.length || 0}
                </span>
                <span className="stat-label">Following</span>
              </div>

              <div className="stat-item">
                <span className="stat-value">
                  {user?.repositories?.length || 0}
                </span>
                <span className="stat-label">Repositories</span>
              </div>
            </div>

            <button
              className="logout-btn-profile"
              onClick={handleLogout}
            >
              Sign out
            </button>
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="profile-content">
          <h2>Activity Overview</h2>
          <div className="activity-placeholder">
            <p>📊 Your contribution graph will appear here</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;




// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./profile.css";
// import Navbar from "../Navbar";
// import { UnderlineNav } from "@primer/react";
// import { BookIcon, RepoIcon } from "@primer/octicons-react";
// import HeatMapProfile from "./HeatMap";
// import { useAuth } from "../../authContext";

// const Profile = () => {
//   const navigate = useNavigate();
//   const [userDetails, setUserDetails] = useState({ username: "username" });
//   const { setCurrentUser } = useAuth();

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       const userId = localStorage.getItem("userId");

//       if (userId) {
//         try {
//           const response = await axios.get(
            // `https://backendgithub-uz08.onrender.com//userProfile/${userId}`
//           );
//           setUserDetails(response.data);
//         } catch (err) {
//           console.error("Cannot fetch user details: ", err);
//         }
//       }
//     };
//     fetchUserDetails();
//   }, []);

//   return (
//     <>
//       <Navbar />
//       <UnderlineNav aria-label="Repository">
//         <UnderlineNav.Item
//           aria-current="page"
//           icon={BookIcon}
//           sx={{
//             backgroundColor: "transparent",
//             color: "white",
//             "&:hover": {
//               textDecoration: "underline",
//               color: "white",
//             },
//           }}
//         >
//           Overview
//         </UnderlineNav.Item>

//         <UnderlineNav.Item
//           onClick={() => navigate("/repo")}
//           icon={RepoIcon}
//           sx={{
//             backgroundColor: "transparent",
//             color: "whitesmoke",
//             "&:hover": {
//               textDecoration: "underline",
//               color: "white",
//             },
//           }}
//         >
//           Starred Repositories
//         </UnderlineNav.Item>
//       </UnderlineNav>

//       <button
//         onClick={() => {
//           localStorage.removeItem("token");
//           localStorage.removeItem("userId");
//           setCurrentUser(null);

//           window.location.href = "/auth";
//         }}
//         style={{ position: "fixed", bottom: "50px", right: "50px" }}
//         id="logout"
//       >
//         Logout
//       </button>

//       <div className="profile-page-wrapper">
//         <div className="user-profile-section">
//           <div className="profile-image"></div>

//           <div className="name">
//             <h3>{userDetails.username}</h3>
//           </div>

//           <button className="follow-btn">Follow</button>

//           <div className="follower">
//             <p>10 Follower</p>
//             <p>3 Following</p>
//           </div>
//         </div>

//         <div className="heat-map-section">
//           <HeatMapProfile />
//         </div>
//       </div>
//     </>
//   );
// };

// export default Profile;
