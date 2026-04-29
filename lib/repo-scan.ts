import fs from "node:fs/promises";
import path from "node:path";

const MARKDOWN_EXTENSIONS = new Set([".md", ".mdx"]);
const IGNORED_DIRS = new Set([".git", "node_modules", ".next", "dist", "build"]);

export async function scanRepo(root: string) {
  const markdownFiles: string[] = [];

  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (IGNORED_DIRS.has(entry.name)) continue;

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();
      if (MARKDOWN_EXTENSIONS.has(ext)) markdownFiles.push(fullPath);
    }
  }

  await walk(root);

  return { markdownFiles };
}
