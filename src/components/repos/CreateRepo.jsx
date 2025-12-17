import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import api from "../../api";

const CreateRepo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    visibility: "public",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.name.trim()) {
        throw new Error("Repository name is required");
      }

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        visibility: formData.visibility,
      };

      console.log("📤 Creating repository:", payload);

      await api.post("/repos/create", payload);

      navigate("/", { replace: true });
    } catch (err) {
      console.error("❌ Error creating repository:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create repository"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Create a new repository</h1>
          <p style={styles.subtitle}>
            A repository contains all project files, history, and collaboration features.
          </p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Repository name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="my-awesome-repo"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                style={styles.textarea}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Visibility</label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="public">🌍 Public</option>
                <option value="private">🔒 Private</option>
              </select>
            </div>

            <div style={styles.actions}>
              <button
                type="button"
                onClick={() => navigate("/")}
                disabled={loading}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={styles.submitBtn}
              >
                {loading ? "Creating..." : "Create repository"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

/* ✅ STYLES MUST BE DEFINED HERE */
const styles = {
  container: {
    padding: "40px 20px",
    maxWidth: "700px",
    margin: "0 auto",
  },
  card: {
    backgroundColor: "#0d1117",
    border: "1px solid #30363d",
    borderRadius: "12px",
    padding: "32px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#c9d1d9",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#8b949e",
    marginBottom: "24px",
  },
  errorBox: {
    backgroundColor: "rgba(248,81,73,0.1)",
    border: "1px solid #da3633",
    color: "#f85149",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "20px",
  },
  form: { display: "flex", flexDirection: "column" },
  formGroup: { marginBottom: "20px" },
  label: { color: "#c9d1d9", marginBottom: "6px", display: "block" },
  input: {
    padding: "10px",
    backgroundColor: "#0d1117",
    border: "1px solid #30363d",
    color: "#c9d1d9",
  },
  textarea: {
    padding: "10px",
    backgroundColor: "#0d1117",
    border: "1px solid #30363d",
    color: "#c9d1d9",
  },
  select: {
    padding: "10px",
    backgroundColor: "#0d1117",
    border: "1px solid #30363d",
    color: "#c9d1d9",
  },
  actions: { display: "flex", gap: "12px", justifyContent: "flex-end" },
  submitBtn: {
    backgroundColor: "#238636",
    color: "white",
    padding: "10px 20px",
    border: "none",
    cursor: "pointer",
  },
  cancelBtn: {
    backgroundColor: "transparent",
    color: "#c9d1d9",
    border: "1px solid #30363d",
    padding: "10px 20px",
    cursor: "pointer",
  },
};

export default CreateRepo;



// /* eslint-disable no-unused-vars */
// import React from "react";
// import Navbar from "../Navbar";

// const CreateRepo = () => {
//   return (
//     <>
//       <Navbar />
//       <div style={{ padding: "2rem", color: "white" }}>
//         <h2>Create Repository</h2>
//         <p>This is a placeholder page for /create.</p>
//         <p>Later you can add a form here to create a new repository.</p>
//       </div>
//     </>
//   );
// };

// export default CreateRepo;
