import simpleGit from "simple-git";

export async function getRecentCommits(repoPath: string) {
  const git = simpleGit(repoPath);
  const log = await git.log({ maxCount: 10 });

  return Promise.all(
    log.all.map(async (commit) => {
      const diff = await git.show([
        "--name-only",
        "--pretty=format:",
        commit.hash,
      ]);

      const changedFiles = diff
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      return {
        hash: commit.hash,
        message: commit.message,
        author: commit.author_name,
        committedAt: new Date(commit.date),
        changedFiles,
      };
    }),
  );
}
