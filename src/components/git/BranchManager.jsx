import React, { useState } from "react";

const BranchManager = ({ git }) => {
  const [newBranchName, setNewBranchName] = useState("");

  const handleCreateBranch = () => {
    if (newBranchName) {
      const result = git.createBranch(newBranchName);
      if (result.success) {
        setNewBranchName("");
        alert("✅ Branch created!");
      } else {
        alert("❌ " + result.message);
      }
    }
  };

  const handleCheckout = (branchName) => {
    git.checkout(branchName);
    alert(`✅ Switched to ${branchName}`);
  };

  return (
    <div className="branch-manager">
      <h3>Branches</h3>

      <div className="branch-form">
        <input
          type="text"
          placeholder="New branch name"
          value={newBranchName}
          onChange={(e) => setNewBranchName(e.target.value)}
        />
        <button onClick={handleCreateBranch} className="btn-primary">
          Create Branch
        </button>
      </div>

      <div className="branches-list">
        {Object.keys(git.branches).map((branchName) => (
          <div key={branchName} className="branch-item">
            <strong>🌿 {branchName}</strong>
            {branchName !== git.currentBranch && (
              <button
                onClick={() => handleCheckout(branchName)}
                className="btn-small"
              >
                Switch
              </button>
            )}
            {branchName === git.currentBranch && (
              <span className="current-badge">current</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BranchManager;
