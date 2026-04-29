type CommitLike = {
  hash: string;
  message: string;
  author: string;
  committedAt: Date;
  changedFiles: string[];
};

function isMarkdownFile(filePath: string) {
  const lower = filePath.toLowerCase();
  return lower.endsWith(".md") || lower.endsWith(".mdx");
}

function createSummary(commit: CommitLike) {
  const fileCount = commit.changedFiles.length;
  const markdownCount = commit.changedFiles.filter(isMarkdownFile).length;

  if (fileCount === 0) return commit.message;
  if (markdownCount === 0) {
    return `${commit.message} · ${fileCount} Datei${fileCount === 1 ? "" : "en"} geändert`;
  }

  return `${commit.message} · ${fileCount} Datei${fileCount === 1 ? "" : "en"} geändert, davon ${markdownCount} Doku`;
}

export function buildLogEntriesFromCommits(commits: CommitLike[]) {
  return commits.map((commit) => {
    const relatedDocs = commit.changedFiles.filter(isMarkdownFile);

    return {
      date: commit.committedAt,
      summary: createSummary(commit),
      changedFiles: JSON.stringify(commit.changedFiles),
      relatedDocs: relatedDocs.length ? JSON.stringify(relatedDocs) : null,
    };
  });
}

export function parseJsonList(value: string | null | undefined) {
  if (!value) return [] as string[];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}
