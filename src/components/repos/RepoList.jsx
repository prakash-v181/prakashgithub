import { useEffect, useState } from "react";
import api from "../../config/api";

import { Link } from "react-router-dom";

const RepoList = () => {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const fetchRepos = async () => {
      const res = await api.get("/repos/all");
      setRepos(res.data);
    };
    fetchRepos();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h2>Your Repositories</h2>

      {repos.map((repo) => (
        <div
          key={repo._id}
          style={{
            borderBottom: "1px solid #30363d",
            padding: "16px 0",
          }}
        >
          <Link
            to={`/repos/${repo._id}`}
            style={{ fontSize: 18, color: "#58a6ff" }}
          >
            {repo.name}
          </Link>

          <p style={{ color: "#8b949e" }}>{repo.description}</p>

          <div style={{ fontSize: 12, color: "#8b949e" }}>
            👤 {repo.owner?.username || "unknown"} •
            🔒 {repo.visibility} • ⭐ {repo.stars}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RepoList;
