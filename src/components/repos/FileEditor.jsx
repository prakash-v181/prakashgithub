import React, { useState } from "react";

const FileEditor = ({ git, files }) => {
  const [newFileName, setNewFileName] = useState("");
  const [newFileContent, setNewFileContent] = useState("");

  const handleCreateFile = () => {
    if (newFileName && newFileContent) {
      git.add(newFileName, newFileContent);
      setNewFileName("");
      setNewFileContent("");
      alert("✅ File added to staging");
    }
  };

  return (
    <div className="file-editor">
      <div className="editor-sidebar">
        <h3>Files</h3>
        <div className="file-list">
          {Object.keys(files).length === 0 ? (
            <p className="empty">No files yet</p>
          ) : (
            Object.keys(files).map((file) => (
              <div key={file} className="file-item">
                📄 {file}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="editor-main">
        <div className="new-file-form">
          <input
            type="text"
            placeholder="File name"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
          />
          <textarea
            placeholder="File content"
            value={newFileContent}
            onChange={(e) => setNewFileContent(e.target.value)}
            rows={10}
          />
          <button onClick={handleCreateFile} className="btn-primary">
            Create File
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileEditor;
