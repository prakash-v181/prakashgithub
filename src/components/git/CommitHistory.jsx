import React, { useState } from "react";

const CommitHistory = ({ commits }) => {
  const [selectedCommit, setSelectedCommit] = useState(null);

  return (
    <div className="commit-history">
      <h3>Commit History</h3>

      {commits.length === 0 ? (
        <p className="empty">No commits yet</p>
      ) : (
        <div className="history-list">
          {commits.map((commit) => (
            <div
              key={commit.hash}
              className="commit-item"
              onClick={() => setSelectedCommit(commit)}
            >
              <div className="commit-hash">{commit.hash.substring(0, 7)}</div>
              <div className="commit-message">{commit.message}</div>
              <div className="commit-meta">
                <small>{commit.author}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCommit && (
        <div className="commit-detail">
          <h4>Commit Details</h4>
          <p>
            <strong>Hash:</strong> {selectedCommit.hash}
          </p>
          <p>
            <strong>Message:</strong> {selectedCommit.message}
          </p>
          <p>
            <strong>Author:</strong> {selectedCommit.author}
          </p>
        </div>
      )}
    </div>
  );
};

export default CommitHistory;
