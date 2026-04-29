import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type RouteContext = {
  params: Promise<{ projectId: string }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { projectId } = await params;

  const logs = await prisma.logEntry.findMany({
    where: { projectId },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(logs);
}
