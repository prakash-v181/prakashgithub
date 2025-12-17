/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import api from "../../api";
import { useAuth } from "../../authContext";
import CommitList from "../commits/CommitList";
import UploadFile from "./UploadFile";

const RepoDetail = () => {
  const { repoId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [repo, setRepo] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("about");

  // 🔧 Edit state
  const [editDesc, setEditDesc] = useState("");
  const [editVisibility, setEditVisibility] = useState("public");
  const [saving, setSaving] = useState(false);

  /* ===============================
     LOAD REPOSITORY
  =============================== */
  useEffect(() => {
    const loadRepo = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/repos/${repoId}`);
        const data = res.data.repo || res.data;
        setRepo(data);
        setEditDesc(data.description || "");
        setEditVisibility(data.visibility || "public");
      } catch {
        setError("Failed to load repository");
      } finally {
        setLoading(false);
      }
    };
    loadRepo();
  }, [repoId]);

  /* ===============================
     LOAD FILES
  =============================== */
  const loadFiles = async () => {
    try {
      const res = await api.get(`/repos/${repoId}/files`);
      setFiles(res.data);
    } catch {
      console.error("Failed to load files");
    }
  };

  useEffect(() => {
    if (activeTab === "files") loadFiles();
  }, [activeTab]);

  /* ===============================
     OWNER CHECK
  =============================== */
  const isOwner =
    repo?.owner &&
    currentUser &&
    repo.owner._id?.toString() === currentUser._id;

  /* ===============================
     SAVE EDITS
  =============================== */
  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await api.put(`/repos/${repo._id}`, {
        description: editDesc,
        visibility: editVisibility,
      });
      setRepo(res.data.repo);
      setActiveTab("about");
      alert("✅ Repository updated");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ===============================
     DELETE REPO
  =============================== */
  const handleDelete = async () => {
    if (!window.confirm("Delete this repository?")) return;
    await api.delete(`/repos/${repo._id}`);
    navigate("/");
  };

  /* ===============================
     UI STATES
  =============================== */
  if (loading) {
    return (
      <>
        <Navbar />
        <div style={styles.center}>Loading repository...</div>
      </>
    );
  }

  if (error || !repo) {
    return (
      <>
        <Navbar />
        <div style={styles.center}>Repository not found</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>{repo.name}</h1>
            <p style={styles.desc}>{repo.description || "No description"}</p>
          </div>

          {isOwner && (
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                style={{ ...styles.badge, background: "#8957e5" }}
                onClick={() => setActiveTab("settings")}
              >
                ✏️ Edit
              </button>
              <button
                style={{ ...styles.badge, background: "#f85149" }}
                onClick={handleDelete}
              >
                🗑 Delete
              </button>
            </div>
          )}
        </div>

        {/* TABS */}
        <div style={styles.tabs}>
          {["about", "files", "commits", ...(isOwner ? ["settings"] : [])].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...styles.tab,
                  borderBottom:
                    activeTab === tab
                      ? "3px solid #58a6ff"
                      : "3px solid transparent",
                }}
              >
                {tab.toUpperCase()}
              </button>
            )
          )}
        </div>

        {/* CONTENT */}
        <div style={styles.content}>
          {activeTab === "about" && (
            <>
              <p>👤 Owner: {repo.owner?.username}</p>
              <p>📅 Created: {new Date(repo.createdAt).toDateString()}</p>
              <p>🔒 Visibility: {repo.visibility}</p>
            </>
          )}

          {activeTab === "files" && (
            <>
              {isOwner && (
                <UploadFile repoId={repoId} onUploaded={loadFiles} />
              )}
              {files.length === 0 ? (
                <p>No files uploaded</p>
              ) : (
                <ul>
                  {files.map((f) => (
                    <li key={f._id}>📄 {f.originalName}</li>
                  ))}
                </ul>
              )}
            </>
          )}

          {activeTab === "commits" && (
            <CommitList repoId={repo._id} isOwner={isOwner} />
          )}

          {activeTab === "settings" && isOwner && (
            <div style={styles.settingsBox}>
              <h3>Edit Repository</h3>

              <label>Name</label>
              <input value={repo.name} disabled style={styles.input} />

              <label>Description</label>
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                style={styles.textarea}
              />

              <label>Visibility</label>
              <select
                value={editVisibility}
                onChange={(e) => setEditVisibility(e.target.value)}
                style={styles.input}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>

              <button
                onClick={handleSave}
                disabled={saving}
                style={styles.saveBtn}
              >
                💾 {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        <button onClick={() => navigate("/")} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
      </div>
    </>
  );
};

/* ===============================
   STYLES
=============================== */
const styles = {
  container: { maxWidth: "1000px", margin: "0 auto", padding: "30px" },
  center: { padding: "60px", textAlign: "center" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #30363d",
    paddingBottom: "16px",
  },
  title: { fontSize: "32px" },
  desc: { color: "#8b949e" },
  badge: {
    padding: "8px 14px",
    borderRadius: "20px",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
  tabs: {
    display: "flex",
    gap: "24px",
    marginTop: "20px",
    borderBottom: "1px solid #30363d",
  },
  tab: {
    padding: "10px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#8b949e",
  },
  content: { padding: "20px 0" },
  input: { width: "100%", padding: "10px", marginBottom: "10px" },
  textarea: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    minHeight: "80px",
  },
  settingsBox: { maxWidth: "500px" },
  saveBtn: {
    marginTop: "10px",
    padding: "10px",
    background: "#238636",
    border: "none",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  },
  backBtn: {
    marginTop: "30px",
    padding: "10px 20px",
    background: "#238636",
    border: "none",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default RepoDetail;


// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Navbar from "../Navbar";
// import api from "../../api";
// import { useAuth } from "../../authContext";
// import CommitList from "../commits/CommitList";
// import UploadFile from "./UploadFile"; // ✅ IMPORT

// const RepoDetail = () => {
//   const { repoId } = useParams();
//   const navigate = useNavigate();
//   const { currentUser } = useAuth();

//   const [repo, setRepo] = useState(null);
//   const [files, setFiles] = useState([]); // ✅ FILES STATE
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("about");

//   // ===============================
//   // LOAD REPOSITORY
//   // ===============================
//   useEffect(() => {
//     if (!repoId) return;

//     const loadRepository = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const res = await api.get(`/repos/${repoId}`);
//         setRepo(res.data.repo || res.data);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to load repository");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadRepository();
//   }, [repoId]);

//   // ===============================
//   // LOAD FILES
//   // ===============================
//   const loadFiles = async () => {
//     try {
//       const res = await api.get(`/repos/${repoId}/files`);
//       setFiles(res.data);
//     } catch (err) {
//       console.error("Failed to load files");
//     }
//   };

//   useEffect(() => {
//     if (activeTab === "files") {
//       loadFiles();
//     }
//   }, [activeTab]);

//   // ===============================
//   // OWNER CHECK
//   // ===============================
//   const isOwner =
//     repo?.owner &&
//     currentUser &&
//     repo.owner._id === currentUser._id;

//   // ===============================
//   // DELETE REPOSITORY
//   // ===============================
//   const handleDelete = async () => {
//     if (!window.confirm("Delete this repository?")) return;

//     try {
//       await api.delete(`/repos/${repo._id}`);
//       navigate("/");
//     } catch (err) {
//       alert(err.response?.data?.message || "Delete failed");
//     }
//   };

//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <div style={styles.loadingContainer}>Loading repository...</div>
//       </>
//     );
//   }

//   if (error || !repo) {
//     return (
//       <>
//         <Navbar />
//         <div style={styles.container}>
//           <div style={styles.errorBox}>
//             {error || "Repository not found"}
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar />

//       <div style={styles.container}>
//         {/* HEADER */}
//         <div style={styles.header}>
//           <div>
//             <h1>{repo.name}</h1>
//             <p>{repo.description || "No description"}</p>
//           </div>

//           {isOwner && (
//             <button onClick={handleDelete} style={styles.deleteBtn}>
//               🗑 Delete
//             </button>
//           )}
//         </div>

//         {/* TABS */}
//         <div style={styles.tabsContainer}>
//           {["about", "files", "commits"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               style={styles.tab}
//             >
//               {tab.toUpperCase()}
//             </button>
//           ))}
//         </div>

//         {/* CONTENT */}
//         <div>
//           {activeTab === "about" && (
//             <p>Owner: {repo.owner?.username}</p>
//           )}

//           {activeTab === "files" && (
//             <>
//               {/* ✅ UPLOAD FILE UI */}
//               {isOwner && (
//                 <UploadFile
//                   repoId={repoId}
//                   onUploaded={loadFiles}
//                 />
//               )}

//               <ul>
//                 {files.length === 0 ? (
//                   <p>No files yet</p>
//                 ) : (
//                   files.map((file) => (
//                     <li key={file._id}>
//                       📄 {file.originalName}
//                     </li>
//                   ))
//                 )}
//               </ul>
//             </>
//           )}

//           {activeTab === "commits" && (
//             <CommitList repoId={repo._id} isOwner={isOwner} />
//           )}
//         </div>

//         <button onClick={() => navigate("/")}>
//           ← Back
//         </button>
//       </div>
//     </>
//   );
// };

// const styles = {
//   container: { maxWidth: "900px", margin: "0 auto", padding: "20px" },
//   header: { display: "flex", justifyContent: "space-between" },
//   tabsContainer: { display: "flex", gap: "20px", marginTop: "20px" },
//   tab: { cursor: "pointer" },
//   deleteBtn: { background: "red", color: "white", border: "none" },
//   loadingContainer: { padding: "40px", textAlign: "center" },
//   errorBox: { color: "red" },
// };

// export default RepoDetail;



// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Navbar from "../Navbar";
// import api from "../../api";
// import { useAuth } from "../../authContext";
// import CommitList from "../commits/CommitList";

// const RepoDetail = () => {
//   const { repoId } = useParams();
//   const navigate = useNavigate();
//   const { currentUser } = useAuth();

//   const [repo, setRepo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("about");

//   // ===============================
//   // LOAD REPOSITORY
//   // ===============================
//   useEffect(() => {
//     if (!repoId) return;

//     const loadRepository = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const res = await api.get(`/repos/${repoId}`);
//         setRepo(res.data.repo || res.data);
//       } catch (err) {
//         setError(
//           err.response?.data?.message || "Failed to load repository"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadRepository();
//   }, [repoId]);

//   // ===============================
//   // DELETE REPOSITORY (OWNER ONLY)
//   // ===============================
//   const handleDelete = async () => {
//     if (!window.confirm("Delete this repository?")) return;

//     try {
//       await api.delete(`/repos/${repo._id}`);
//       navigate("/");
//     } catch (err) {
//       alert(err.response?.data?.message || "Delete failed");
//     }
//   };

//   // ===============================
//   // LOADING / ERROR
//   // ===============================
//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <div style={styles.loadingContainer}>
//           <div style={styles.spinner}></div>
//           <p>Loading repository...</p>
//         </div>
//       </>
//     );
//   }

//   if (error || !repo) {
//     return (
//       <>
//         <Navbar />
//         <div style={styles.container}>
//           <div style={styles.errorBox}>
//             {error || "Repository not found"}
//           </div>
//           <button onClick={() => navigate("/")} style={styles.backBtn}>
//             ← Back to Dashboard
//           </button>
//         </div>
//       </>
//     );
//   }

//   // ===============================
//   // OWNER CHECK
//   // ===============================
//   const isOwner =
//     repo?.owner &&
//     currentUser &&
//     repo.owner._id === currentUser._id;

//   // ===============================
//   // RENDER
//   // ===============================
//   return (
//     <>
//       <Navbar />

//       <div style={styles.container}>
//         {/* HEADER */}
//         <div style={styles.header}>
//           <div>
//             <h1 style={styles.repoName}>{repo.name}</h1>
//             <p style={styles.repoDesc}>
//               {repo.description || "No description provided"}
//             </p>
//           </div>

//           <div style={{ display: "flex", gap: "12px" }}>
//             <span
//               style={{
//                 ...styles.badge,
//                 backgroundColor:
//                   repo.visibility === "private"
//                     ? "#da3633"
//                     : "#238636",
//               }}
//             >
//               {repo.visibility === "private"
//                 ? "🔒 Private"
//                 : "🌍 Public"}
//             </span>

//             {isOwner && (
//               <>
//                 <button
//                   onClick={() => setActiveTab("settings")}
//                   style={{
//                     ...styles.badge,
//                     backgroundColor: "#8957e5",
//                   }}
//                 >
//                   ✏️ Edit
//                 </button>

//                 <button
//                   onClick={handleDelete}
//                   style={{
//                     ...styles.badge,
//                     backgroundColor: "#f85149",
//                   }}
//                 >
//                   🗑 Delete
//                 </button>
//               </>
//             )}
//           </div>
//         </div>

//         {/* TABS */}
//         <div style={styles.tabsContainer}>
//           {[
//             "about",
//             "files",
//             "commits",
//             "branches",
//             ...(isOwner ? ["settings"] : []),
//           ].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               style={{
//                 ...styles.tab,
//                 borderBottom:
//                   activeTab === tab
//                     ? "3px solid #58a6ff"
//                     : "3px solid transparent",
//                 color:
//                   activeTab === tab ? "#58a6ff" : "#8b949e",
//               }}
//             >
//               {tab.toUpperCase()}
//             </button>
//           ))}
//         </div>

//         {/* CONTENT */}
//         <div style={styles.content}>
//           {activeTab === "about" && (
//             <div>
//               <p>👤 Owner: {repo.owner?.username || "Unknown"}</p>
//               <p>
//                 📅 Created:{" "}
//                 {new Date(repo.createdAt).toDateString()}
//               </p>
//             </div>
//           )}

//           {activeTab === "commits" && (
//             <CommitList repoId={repo._id} isOwner={isOwner} />
//           )}

//           {activeTab === "settings" && isOwner && (
//             <div>
//               <h3>Edit Repository</h3>

//               <input
//                 type="text"
//                 value={repo.name}
//                 disabled
//                 style={styles.input}
//               />

//               <textarea
//                 defaultValue={repo.description}
//                 placeholder="Description"
//                 style={styles.textarea}
//               />

//               <select
//                 defaultValue={repo.visibility}
//                 style={styles.select}
//               >
//                 <option value="public">Public</option>
//                 <option value="private">Private</option>
//               </select>

//               <p style={{ color: "#8b949e", fontSize: "13px" }}>
//                 ⚠️ Save logic will be connected next
//               </p>
//             </div>
//           )}

//           {activeTab !== "about" &&
//             activeTab !== "commits" &&
//             activeTab !== "settings" && (
//               <div style={styles.placeholder}>
//                 🚧 Coming soon
//               </div>
//             )}
//         </div>

//         <button onClick={() => navigate("/")} style={styles.backBtn}>
//           ← Back to Dashboard
//         </button>
//       </div>
//     </>
//   );
// };

// // ===============================
// // STYLES
// // ===============================
// const styles = {
//   container: {
//     padding: "40px 20px",
//     maxWidth: "1000px",
//     margin: "0 auto",
//   },
//   loadingContainer: {
//     padding: "80px",
//     textAlign: "center",
//     color: "#8b949e",
//   },
//   spinner: {
//     width: "40px",
//     height: "40px",
//     border: "4px solid #30363d",
//     borderTopColor: "#58a6ff",
//     borderRadius: "50%",
//     margin: "0 auto 20px",
//   },
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginBottom: "24px",
//     borderBottom: "1px solid #30363d",
//     paddingBottom: "16px",
//   },
//   repoName: {
//     fontSize: "32px",
//     color: "#c9d1d9",
//   },
//   repoDesc: {
//     color: "#8b949e",
//   },
//   badge: {
//     padding: "6px 12px",
//     borderRadius: "20px",
//     fontSize: "12px",
//     color: "white",
//     border: "none",
//     cursor: "pointer",
//   },
//   tabsContainer: {
//     display: "flex",
//     gap: "24px",
//     borderBottom: "1px solid #30363d",
//     marginBottom: "20px",
//   },
//   tab: {
//     padding: "10px",
//     background: "none",
//     border: "none",
//     cursor: "pointer",
//   },
//   content: {
//     marginBottom: "30px",
//   },
//   placeholder: {
//     padding: "60px",
//     textAlign: "center",
//     color: "#8b949e",
//   },
//   backBtn: {
//     padding: "10px 24px",
//     backgroundColor: "#238636",
//     color: "white",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//   },
//   errorBox: {
//     backgroundColor: "rgba(248,81,73,0.1)",
//     border: "1px solid #da3633",
//     color: "#f85149",
//     padding: "16px",
//     borderRadius: "6px",
//   },
//   input: {
//     width: "100%",
//     padding: "10px",
//     marginBottom: "12px",
//   },
//   textarea: {
//     width: "100%",
//     padding: "10px",
//     marginBottom: "12px",
//   },
//   select: {
//     width: "100%",
//     padding: "10px",
//     marginBottom: "12px",
//   },
// };

// export default RepoDetail;
