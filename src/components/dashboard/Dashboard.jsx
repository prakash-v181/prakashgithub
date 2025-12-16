import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import api from "../../api";
import "./dashboard.css";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Get current user
      const meRes = await api.get("/auth/me");
      setUser(meRes.data);

      // ✅ Get repositories
      const repoRes = await api.get("/repos/all");

      const repos = Array.isArray(repoRes.data)
        ? repoRes.data
        : repoRes.data?.repositories || [];

      setRepositories(repos);
    } catch (err) {
      console.error("Dashboard load failed:", err);
      setError(err.response?.data?.message || "Failed to load dashboard");
      setRepositories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="gh-page">
        <div className="row">
          {/* ================= LEFT SIDEBAR ================= */}
          <div className="col-lg-3 mb-3">
            <aside className="gh-sidebar">
              <div className="gh-profile-block">
                <div className="gh-profile-avatar-lg">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </div>

                <div className="gh-profile-name">
                  {user?.username || "User"}
                </div>

                <div className="gh-profile-username">
                  @{user?.username || "username"}
                </div>

                <p className="gh-profile-bio">
                  Full-stack developer • GitHub clone project
                </p>

                {/* ✅ PUBLIC PROFILE LINK */}
                <a
                  href="https://prakash-v181.github.io/github.io-my-github-profile-pr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-link"
                >
                  🔗 Profile  Github-clone
                </a>
              </div>

              <div className="gh-sidebar-section">
                <div className="gh-sidebar-section-header">Overview</div>

                <button
                  className="gh-sidebar-item"
                  onClick={() => navigate("/")}
                >
                  📊 Dashboard
                </button>

                <button
                  className="gh-sidebar-item"
                  onClick={() => navigate("/profile")}
                >
                  👤 Profile
                </button>

                <button
                  className="gh-sidebar-item"
                  onClick={() => navigate("/new")}
                >
                  📁 New Repository
                </button>
              </div>

              <div className="gh-sidebar-section">
                <div className="gh-sidebar-section-header">
                  Your repositories
                </div>

                {repositories.slice(0, 5).map((repo) => (
                  <div
                    key={repo._id}
                    className="gh-sidebar-repo"
                    onClick={() => navigate(`/repo/${repo._id}`)}
                  >
                    <div className="gh-sidebar-repo-name">{repo.name}</div>
                    {repo.description && (
                      <div className="gh-sidebar-repo-desc">
                        {repo.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </aside>
          </div>

          {/* ================= MAIN CONTENT ================= */}
          <div className="col-lg-9">
            <main className="gh-main">
              <div className="gh-hero mb-3">
                <div className="gh-hero-title">Dashboard</div>
                <div className="gh-hero-subtitle">
                  Manage your repositories
                </div>
              </div>

              {error && (
                <div className="gh-card mb-3">
                  <div className="gh-card-body">
                    <strong>⚠️ Error:</strong> {error}
                  </div>
                </div>
              )}

              <div className="gh-card">
                <div className="gh-card-header">
                  <div className="gh-card-title">Your Repositories</div>
                  <Link to="/new">
                    <button className="btn-gh btn-gh-primary">
                      + New repository
                    </button>
                  </Link>
                </div>

                <div className="gh-card-body">
                  {repositories.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📦</div>
                      <h3>No repositories yet</h3>
                      <p>Create your first repository</p>
                      <Link to="/new">
                        <button className="btn-gh btn-gh-primary">
                          Create repository
                        </button>
                      </Link>
                    </div>
                  ) : (
                    <ul className="gh-repo-list">
                      {repositories.map((repo) => (
                        <li key={repo._id} className="gh-repo-item">
                          <div className="gh-repo-name-row">
                            <Link
                              to={`/repo/${repo._id}`}
                              className="gh-repo-name"
                            >
                              {repo.name}
                            </Link>
                            <span className="gh-repo-visibility">
                              {repo.visibility}
                            </span>
                          </div>

                          <div className="gh-repo-desc">
                            {repo.description || "No description"}
                          </div>

                          <div className="gh-repo-meta">
                            <span>
                              👤 {repo.owner?.username || "Unknown"}
                            </span>
                            <span>⭐ {repo.stars || 0}</span>
                            <span>🔀 0</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;








// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Navbar from "../Navbar";
// import api from "../../api";
// import "./dashboard.css";

// const Dashboard = () => {
//   const [repositories, setRepositories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadRepositories();
//   }, []);

//   const loadRepositories = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await api.get("/repos/all");

//       const repos = Array.isArray(response.data)
//         ? response.data
//         : response.data?.repositories || [];

//       setRepositories(repos);
//     } catch (err) {
//       console.error("Failed to load repositories:", err);
//       setError(err.response?.data?.message || "Failed to load repositories");
//       setRepositories([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <div className="dashboard-container">
//           <div className="loading">
//             <div className="spinner"></div>
//             <p>Loading repositories...</p>
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar />

//       <div className="gh-page">
//         <div className="row">
//           {/* LEFT SIDEBAR */}
//           <div className="col-lg-3 mb-3">
//             <aside className="gh-sidebar">
//               <div className="gh-profile-block">
//                 <div className="gh-profile-avatar-lg">P</div>
//                 <div className="gh-profile-name">Prakash</div>
//                 <div className="gh-profile-username">@prakash-dev</div>
//                 <p className="gh-profile-bio">
//                   Full-stack developer • GitHub clone project
//                 </p>
//               </div>

//               <div className="gh-sidebar-section">
//                 <div className="gh-sidebar-section-header">Overview</div>

//                 <button className="gh-sidebar-item" onClick={() => navigate("/")}>
//                   📊 Dashboard
//                 </button>
//                 <button
//                   className="gh-sidebar-item"
//                   onClick={() => navigate("/profile")}
//                 >
//                   👤 Profile
//                 </button>
//                 <button
//                   className="gh-sidebar-item"
//                   onClick={() => navigate("/new")}
//                 >
//                   📁 New Repository
//                 </button>
//               </div>

//               <div className="gh-sidebar-section">
//                 <div className="gh-sidebar-section-header">
//                   Your repositories
//                 </div>

//                 {repositories.slice(0, 5).map((repo) => (
//                   <div
//                     key={repo._id}
//                     className="gh-sidebar-repo"
//                     onClick={() => navigate(`/repo/${repo._id}`)}
//                   >
//                     <div className="gh-sidebar-repo-name">{repo.name}</div>
//                     {repo.description && (
//                       <div className="gh-sidebar-repo-desc">
//                         {repo.description}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </aside>
//           </div>

//           {/* MAIN CONTENT */}
//           <div className="col-lg-9">
//             <main className="gh-main">
//               <div className="gh-hero mb-3">
//                 <div className="gh-hero-title">Dashboard</div>
//                 <div className="gh-hero-subtitle">
//                   Manage your repositories
//                 </div>
//               </div>

//               {error && (
//                 <div className="gh-card mb-3">
//                   <div className="gh-card-body">
//                     <strong>⚠️ Error:</strong> {error}
//                   </div>
//                 </div>
//               )}

//               <div className="gh-card">
//                 <div className="gh-card-header">
//                   <div className="gh-card-title">Your Repositories</div>
//                   <Link to="/new">
//                     <button className="btn-gh btn-gh-primary">
//                       + New repository
//                     </button>
//                   </Link>
//                 </div>

//                 <div className="gh-card-body">
//                   {repositories.length === 0 ? (
//                     <div className="empty-state">
//                       <div className="empty-icon">📦</div>
//                       <h3>No repositories yet</h3>
//                       <p>Create your first repository</p>
//                       <Link to="/new">
//                         <button className="btn-gh btn-gh-primary">
//                           Create repository
//                         </button>
//                       </Link>
//                     </div>
//                   ) : (
//                     <ul className="gh-repo-list">
//                       {repositories.map((repo) => (
//                         <li key={repo._id} className="gh-repo-item">
//                           <div className="gh-repo-name-row">
//                             <Link
//                               to={`/repo/${repo._id}`}
//                               className="gh-repo-name"
//                             >
//                               {repo.name}
//                             </Link>
//                             <span className="gh-repo-visibility">
//                               {repo.visibility}
//                             </span>
//                           </div>

//                           <div className="gh-repo-desc">
//                             {repo.description || "No description"}
//                           </div>

//                           <div className="gh-repo-meta">
//                             <span>
//                               👤 {repo.owner?.username || "Unknown"}
//                             </span>
//                             <span>⭐ {repo.stars || 0}</span>
//                             <span>🔀 0</span>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               </div>
//             </main>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Dashboard;



// import React, { useState, useEffect } from "react";
// import "./dashboard.css";
// import Navbar from "../Navbar";

// const Dashboard = () => {
//   const [repositories, setRepositories] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestedRepositories, setSuggestedRepositories] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);

//   useEffect(() => {
//     const userId = localStorage.getItem("userId");

//     const fetchRepositories = async () => {
//       try {
//         const response = await fetch(
          // `https://backendgithub-uz08.onrender.com/repo/user/${userId}`
//         );
//         const data = await response.json();
//         setRepositories(data.repositories);
//       } catch (err) {
//         console.error("Error while fecthing repositories: ", err);
//       }
//     };

//     const fetchSuggestedRepositories = async () => {
//       try {
        // const response = await fetch(`https://backendgithub-uz08.onrender.com`);
//         const data = await response.json();
//         setSuggestedRepositories(data);
//         console.log(suggestedRepositories);
//       } catch (err) {
//         console.error("Error while fecthing repositories: ", err);
//       }
//     };

//     fetchRepositories();
//     fetchSuggestedRepositories();
//   }, []);

//   useEffect(() => {
//     if (searchQuery == "") {
//       setSearchResults(repositories);
//     } else {
//       const filteredRepo = repositories.filter((repo) =>
//         repo.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setSearchResults(filteredRepo);
//     }
//   }, [searchQuery, repositories]);

//   return (
//     <>
//       <Navbar />
//       <section id="dashboard">
//         <aside>
//           <h3>Suggested Repositories</h3>
//           {suggestedRepositories.map((repo) => {
//             return (
//               <div key={repo._id}>
//                 <h4>{repo.name}</h4>
//                 <h4>{repo.description}</h4>
//               </div>
//             );
//           })}
//         </aside>
//         <main>
//           <h2>Your Repositories</h2>
//           <div id="search">
//             <input
//               type="text"
//               value={searchQuery}
//               placeholder="Search..."
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//           {searchResults.map((repo) => {
//             return (
//               <div key={repo._id}>
//                 <h4>{repo.name}</h4>
//                 <h4>{repo.description}</h4>
//               </div>
//             );
//           })}
//         </main>
//         <aside>
//           <h3>Upcoming Events</h3>
//           <ul>
//             <li>
//               <p>Tech Conference - Dec 15</p>
//             </li>
//             <li>
//               <p>Developer Meetup - Dec 25</p>
//             </li>
//             <li>
//               <p>React Summit - Jan 5</p>
//             </li>
//           </ul>
//         </aside>
//       </section>
//     </>
//   );
// };

// export default Dashboard;
