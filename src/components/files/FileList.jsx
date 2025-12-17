import React, { useEffect, useState } from "react";
import api from "../../api";

const FileList = ({ repoId }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFiles = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/repos/${repoId}/files`);
      setFiles(res.data || []);
    } catch (err) {
      console.error("Failed to load files", err);
      setError("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (repoId) loadFiles();
  }, [repoId]);

  if (loading) return <p>Loading files...</p>;
  if (error) return <p style={{ color: "#f85149" }}>{error}</p>;

  if (files.length === 0) {
    return <p style={{ color: "#8b949e" }}>No files uploaded yet</p>;
  }

  return (
    <div style={styles.list}>
      {files.map((file) => (
        <div key={file._id} style={styles.item}>
          <div>
            <strong>📄 {file.originalName}</strong>
            <div style={styles.meta}>
              {Math.round(file.size / 1024)} KB •{" "}
              {new Date(file.createdAt).toLocaleDateString()} •{" "}
              {file.uploadedBy?.username || "Unknown"}
            </div>
          </div>

          <a
            href={`https://backendgithub-uz08.onrender.com/${file.path}`}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.download}
          >
            ⬇️ Download
          </a>
        </div>
      ))}
    </div>
  );
};

const styles = {
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  item: {
    padding: "12px",
    border: "1px solid #30363d",
    borderRadius: "6px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meta: {
    fontSize: "12px",
    color: "#8b949e",
  },
  download: {
    color: "#58a6ff",
    textDecoration: "none",
    fontSize: "14px",
  },
};

export default FileList;
