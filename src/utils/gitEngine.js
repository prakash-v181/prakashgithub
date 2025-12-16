class GitEngine {
  constructor() {
    this.commits = [];
    this.branches = { main: [] };
    this.currentBranch = "main";
    this.stagedFiles = {};
    this.fileHistory = {};
  }

  init() {
    this.commits = [];
    this.branches = { main: [] };
    this.currentBranch = "main";
    this.stagedFiles = {};
    return { success: true, message: "Repository initialized" };
  }

  add(filePath, content) {
    this.stagedFiles[filePath] = { content, timestamp: new Date().toISOString() };
    return { success: true, message: `${filePath} staged`, staged: Object.keys(this.stagedFiles) };
  }

  commit(message, author) {
    if (Object.keys(this.stagedFiles).length === 0) {
      return { success: false, message: "Nothing to commit" };
    }

    const commit = {
      hash: this._generateHash(),
      message,
      author,
      timestamp: new Date().toISOString(),
      files: { ...this.stagedFiles },
      branch: this.currentBranch,
    };

    this.commits.push(commit);
    this.branches[this.currentBranch].push(commit.hash);
    this.stagedFiles = {};

    return { success: true, message: `Commit ${commit.hash.substring(0, 7)} created`, commit };
  }

  createBranch(branchName) {
    if (this.branches[branchName]) {
      return { success: false, message: "Branch already exists" };
    }
    this.branches[branchName] = [...(this.branches[this.currentBranch] || [])];
    return { success: true, message: `Branch '${branchName}' created`, branches: Object.keys(this.branches) };
  }

  checkout(branchName) {
    if (!this.branches[branchName]) {
      return { success: false, message: "Branch does not exist" };
    }
    this.currentBranch = branchName;
    return { success: true, message: `Switched to '${branchName}'`, currentBranch: this.currentBranch };
  }

  deleteBranch(branchName) {
    if (branchName === this.currentBranch) {
      return { success: false, message: "Cannot delete current branch" };
    }
    delete this.branches[branchName];
    return { success: true, message: `Branch '${branchName}' deleted` };
  }

  getStatus() {
    return {
      currentBranch: this.currentBranch,
      stagedFiles: Object.keys(this.stagedFiles),
      branches: Object.keys(this.branches),
      commits: this.commits.length,
    };
  }

  _generateHash() {
    return "commit_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

export default GitEngine;
