import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getRecentCommits } from "@/lib/git";
import { extractFirstHeading } from "@/lib/markdown";
import { scanRepo } from "@/lib/repo-scan";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_: Request, { params }: RouteContext) {
  const { id } = await params;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const { markdownFiles } = await scanRepo(project.repoPath);
  const commits = await getRecentCommits(project.repoPath);

  await prisma.markdownFile.deleteMany({ where: { projectId: project.id } });

  for (const filePath of markdownFiles) {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = matter(raw);
    const stat = await fs.stat(filePath);

    await prisma.markdownFile.create({
      data: {
        projectId: project.id,
        path: path.relative(project.repoPath, filePath),
        title:
          typeof parsed.data.title === "string"
            ? parsed.data.title
            : extractFirstHeading(raw),
        content: raw,
        lastModified: stat.mtime,
      },
    });
  }

  await prisma.commitEntry.deleteMany({ where: { projectId: project.id } });

  for (const commit of commits) {
    await prisma.commitEntry.create({
      data: {
        projectId: project.id,
        hash: commit.hash,
        message: commit.message,
        author: commit.author,
        committedAt: commit.committedAt,
        changedFiles: JSON.stringify(commit.changedFiles),
      },
    });
  }

  return NextResponse.json({
    ok: true,
    markdownCount: markdownFiles.length,
    commitCount: commits.length,
  });
}
