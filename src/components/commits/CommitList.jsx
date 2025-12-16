import React, { useEffect, useState } from "react";
import api from "../../api";

const CommitList = ({ repoId, isOwner }) => {
  const [commits, setCommits] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ==========================
  // LOAD COMMITS (BY REPO)
  // ==========================
  useEffect(() => {
    if (!repoId) return;

    const fetchCommits = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ CORRECT API
        const res = await api.get(`/repos/${repoId}/commits`);
        setCommits(res.data);
      } catch (err) {
        console.error("Failed to load commits", err);
        setError("Failed to load commits");
      } finally {
        setLoading(false);
      }
    };

    fetchCommits();
  }, [repoId]);

  // ==========================
  // CREATE COMMIT (OWNER ONLY)
  // ==========================
  const handleCommit = async () => {
    if (!message.trim()) {
      alert("Commit message required");
      return;
    }

    try {
      setSubmitting(true);

      // ✅ CORRECT API
      await api.post(`/repos/${repoId}/commits`, {
        message: message.trim(),
      });

      setMessage("");

      // reload commits
      const res = await api.get(`/repos/${repoId}/commits`);
      setCommits(res.data);
    } catch (err) {
      console.error("Commit failed", err);
      alert(err.response?.data?.message || "Commit failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================
  // UI STATES
  // ==========================
  if (loading) {
    return <p style={{ color: "#8b949e" }}>Loading commits…</p>;
  }

  if (error) {
    return <p style={{ color: "#f85149" }}>{error}</p>;
  }

  return (
    <div>
      {/* ==========================
          CREATE COMMIT (OWNER)
      ========================== */}
      {isOwner && (
        <div style={styles.commitBox}>
          <div style={styles.commitHeader}>💬 Commit changes</div>

          <textarea
            placeholder="Write a commit message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={styles.textarea}
          />

          <button
            onClick={handleCommit}
            style={styles.commitBtn}
            disabled={submitting}
          >
            {submitting ? "Committing..." : "Commit"}
          </button>
        </div>
      )}

      {/* ==========================
          COMMIT LIST
      ========================== */}
      {commits.length === 0 ? (
        <p style={{ color: "#8b949e" }}>No commits yet</p>
      ) : (
        <ul style={styles.list}>
          {commits.map((c) => (
            <li key={c._id} style={styles.item}>
              <div style={styles.message}>{c.message}</div>
              <div style={styles.meta}>
                {c.author?.username || "Unknown"} •{" "}
                {new Date(c.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  commitBox: {
    background: "#0d1117",
    border: "1px solid #30363d",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "24px",
  },
  commitHeader: {
    fontWeight: "600",
    marginBottom: "10px",
    color: "#c9d1d9",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    background: "#010409",
    color: "#c9d1d9",
    border: "1px solid #30363d",
    borderRadius: "6px",
    resize: "vertical",
  },
  commitBtn: {
    background: "#238636",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  item: {
    padding: "12px",
    borderBottom: "1px solid #30363d",
  },
  message: {
    color: "#c9d1d9",
    fontWeight: "500",
    marginBottom: "4px",
  },
  meta: {
    fontSize: "12px",
    color: "#8b949e",
  },
};

export default CommitList;
