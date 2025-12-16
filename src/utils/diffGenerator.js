class DiffGenerator {
  static generateDiff(oldContent = "", newContent = "") {
    const oldLines = oldContent.split("\n");
    const newLines = newContent.split("\n");
    const diff = [];

    const maxLines = Math.max(oldLines.length, newLines.length);
    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i] || "";
      const newLine = newLines[i] || "";

      if (oldLine !== newLine) {
        if (oldLine) diff.push({ type: "removed", line: oldLine });
        if (newLine) diff.push({ type: "added", line: newLine });
      } else {
        diff.push({ type: "unchanged", line: oldLine });
      }
    }
    return diff;
  }

  static getFileStats(oldContent = "", newContent = "") {
    const oldLines = oldContent.split("\n").filter((l) => l.trim());
    const newLines = newContent.split("\n").filter((l) => l.trim());
    return {
      additions: newLines.length - oldLines.length,
      deletions: oldLines.length - newLines.length,
    };
  }
}

export default DiffGenerator;
