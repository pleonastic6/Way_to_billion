import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const createProjectSchema = z.object({
  name: z.string().min(1),
  repoPath: z.string().min(1),
  description: z.string().optional(),
});

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createProjectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const project = await prisma.project.create({
    data: {
      name: parsed.data.name,
      repoPath: path.resolve(parsed.data.repoPath),
      description: parsed.data.description,
    },
  });

  return NextResponse.json(project, { status: 201 });
}
