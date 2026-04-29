import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type RouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { projectId } = await params;

  const commits = await prisma.commitEntry.findMany({
    where: { projectId },
    orderBy: { committedAt: "desc" },
  });

  return NextResponse.json(commits);
}
