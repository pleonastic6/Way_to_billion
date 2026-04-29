import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type RouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { projectId } = await params;

  const files = await prisma.markdownFile.findMany({
    where: { projectId },
    orderBy: { lastModified: "desc" },
  });

  return NextResponse.json(files);
}
