import { parseJsonList } from "@/lib/logs";

type MarkdownLike = {
  path: string;
  title: string | null;
  lastModified: Date | null;
};

type CommitLike = {
  message: string;
  committedAt: Date;
  changedFiles: string;
};

type LogLike = {
  summary: string;
  relatedDocs: string | null;
};

export function buildProjectSummary(input: {
  name: string;
  markdownFiles: MarkdownLike[];
  commits: CommitLike[];
  logEntries: LogLike[];
}) {
  const recentCommits = input.commits.slice(0, 5);
  const recentDocs = [...input.markdownFiles]
    .sort((a, b) => (b.lastModified?.getTime() ?? 0) - (a.lastModified?.getTime() ?? 0))
    .slice(0, 5);

  const docSet = new Set<string>();
  for (const entry of input.logEntries) {
    for (const doc of parseJsonList(entry.relatedDocs)) docSet.add(doc);
  }

  const changedFileCount = input.commits.reduce(
    (sum, commit) => sum + parseJsonList(commit.changedFiles).length,
    0,
  );

  return {
    intro: `Das Projekt ${input.name} umfasst aktuell ${input.markdownFiles.length} erfasste Markdown-Dateien und ${input.commits.length} eingelesene Commits.`,
    recentCommitMessages: recentCommits.map((commit) => commit.message),
    recentDocs: recentDocs.map((file) => file.title || file.path),
    touchedDocs: [...docSet],
    changedFileCount,
  };
}
