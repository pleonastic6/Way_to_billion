import Link from "next/link";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      markdownFiles: true,
      commits: true,
      logEntries: {
        orderBy: { date: "desc" },
        take: 1,
      },
    },
  });

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-zinc-400">
              Repo overview + project documentation
            </span>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Way to Billion
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-zinc-400">
                Eine Web-App für kleine Projektteams, die Repositories
                übersichtlich macht, Markdown-Dokumentation verfolgt und
                Fortschritt strukturiert festhält.
              </p>
            </div>
          </div>

          <Link
            href="/projects/new"
            className="inline-flex rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500"
          >
            Projekt hinzufügen
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="mb-2 text-lg font-medium">Repo Overview</h2>
            <p className="text-sm text-zinc-400">
              Projektstruktur, wichtige Dateien und letzte Aktivität auf einen
              Blick.
            </p>
          </section>
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="mb-2 text-lg font-medium">Markdown Tracking</h2>
            <p className="text-sm text-zinc-400">
              README, TODOs und Doku-Dateien gesammelt analysieren und
              Änderungen sichtbar machen.
            </p>
          </section>
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="mb-2 text-lg font-medium">Project Log</h2>
            <p className="text-sm text-zinc-400">
              Fortschritt, Entscheidungen und offene Punkte automatisch für die
              spätere Doku vorbereiten.
            </p>
          </section>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Deine Projekte</h2>
            <span className="text-sm text-zinc-500">{projects.length} erfasst</span>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/60 p-8 text-zinc-400">
              Noch keine Projekte angelegt. Füge zuerst ein lokales Repo hinzu.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={{
                    id: project.id,
                    name: project.name,
                    description: project.description,
                    updatedAt: project.updatedAt,
                    markdownCount: project.markdownFiles.length,
                    commitCount: project.commits.length,
                    latestLog: project.logEntries[0]?.summary ?? null,
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
