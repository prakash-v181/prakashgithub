// src/components/RepoList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";

export default function RepoList({ onSelectRepo }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const base = API_BASE_URL || "/api";
        // Try plural first, fallback to singular route (match your backend)
        let res;
        try {
          res = await axios.get(`${base}/repos`, { withCredentials: true });
        } catch (err) {
          res = await axios.get(`${base}/repo`, { withCredentials: true });
        }
        // assume data is an array
        setRepos(res.data?.repos || res.data || []);
      } catch (err) {
        console.error("Failed to load repos", err);
        setRepos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  return (
    <aside className="gh-leftpane">
      <div className="gh-leftpane-header">
        <h3>Top repositories</h3>
        <a className="gh-new-btn" href="/create">New</a>
      </div>

      <div className="gh-repo-search">
        <input placeholder="Find a repository..." />
      </div>

      <div className="gh-repo-list">
        {loading ? (
          <div className="gh-muted">Loading...</div>
        ) : repos.length ? (
          repos.map((r) => (
            <button key={r.id || r.name} className="gh-repo-item" onClick={() => onSelectRepo?.(r)}>
              <div className="gh-repo-name">{r.owner ? `${r.owner}/${r.name}` : r.full_name || r.name}</div>
            </button>
          ))
        ) : (
          <div className="gh-muted">No repositories found</div>
        )}
      </div>
    </aside>
  );
}
