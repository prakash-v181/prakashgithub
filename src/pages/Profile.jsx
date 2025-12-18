import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../../config/api";


const Profile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const loadProfile = async () => {
      const res = await api.get(`/users/profile/${username}`);
      setUser(res.data.user);
      setRepos(res.data.repos);
    };
    loadProfile();
  }, [username]);

  if (!user) return null;

  return (
    <>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
        <div style={{ display: "flex", gap: 32 }}>
          {/* LEFT */}
          <div style={{ width: 280 }}>
            <div style={{ fontSize: 80 }}>👤</div>
            <h2>{user.name}</h2>
            <p style={{ color: "#8b949e" }}>@{user.username}</p>
            <p>{user.bio || "No bio provided"}</p>
          </div>

          {/* RIGHT */}
          <div style={{ flex: 1 }}>
            <h3>Repositories</h3>

            {repos.map((repo) => (
              <div
                key={repo._id}
                style={{
                  borderBottom: "1px solid #30363d",
                  padding: "16px 0",
                }}
              >
                <Link
                  to={`/repo/${repo._id}`}
                  style={{ fontSize: 18, color: "#58a6ff" }}
                >
                  {repo.name}
                </Link>

                <p style={{ color: "#8b949e" }}>
                  {repo.description || "No description"}
                </p>

                <span style={{ fontSize: 12 }}>
                  {repo.visibility} • ⭐ {repo.stars}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
