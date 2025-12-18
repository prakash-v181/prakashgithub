import React, { useState } from "react";
import api from "../../config/api";


const UploadFile = ({ repoId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();

    // 🔴 THIS IS THE MOST IMPORTANT LINE
    formData.append("file", file);

    try {
      setUploading(true);

      await api.post(`/repos/${repoId}/files`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFile(null);
      onUploadSuccess?.(); // reload files
    } catch (err) {
      console.error("❌ Upload error:", err);
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h4>📁 Upload File</h4>

      <input type="file" onChange={handleFileChange} />

      <button
        onClick={handleUpload}
        disabled={uploading}
        style={styles.button}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {error && <p style={styles.error}>⚠️ {error}</p>}
    </div>
  );
};

const styles = {
  container: {
    padding: "16px",
    border: "1px solid #30363d",
    borderRadius: "6px",
    marginBottom: "20px",
  },
  button: {
    marginTop: "10px",
    padding: "6px 12px",
    backgroundColor: "#238636",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  error: {
    color: "#f85149",
    marginTop: "8px",
  },
};

export default UploadFile;
