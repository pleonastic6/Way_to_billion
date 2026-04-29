import Link from "next/link";
import { notFound } from "next/navigation";
import { ScanButton } from "@/components/projects/ScanButton";
import { prisma } from "@/lib/db";
import { parseJsonList } from "@/lib/logs";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      markdownFiles: {
        orderBy: { lastModified: "desc" },
        take: 6,
      },
      commits: {
        orderBy: { committedAt: "desc" },
        take: 8,
      },
      logEntries: {
        orderBy: { date: "desc" },
        take: 5,
      },
    },
  });

  if (!project) notFound();

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="space-y-4">
          <Link href="/" className="text-sm text-zinc-400 transition hover:text-zinc-200">
            ← Zurück zum Dashboard
          </Link>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight">{project.name}</h1>
              <p className="mt-3 max-w-3xl text-zinc-400">
                {project.description || "Keine Beschreibung vorhanden."}
              </p>
              <p className="mt-2 text-sm text-zinc-500">{project.repoPath}</p>
            </div>

            <ScanButton projectId={project.id} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Markdown-Dateien" value={String(project.markdownFiles.length)} />
          <StatCard label="Commits" value={String(project.commits.length)} />
          <StatCard label="Logeinträge" value={String(project.logEntries.length)} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Section title="Letzte Commits">
            {project.commits.length === 0 ? (
              <EmptyState text="Noch keine Commits eingelesen. Starte zuerst einen Repo-Scan." />
            ) : (
              <ul className="space-y-3">
                {project.commits.map((commit) => {
                  const changedFiles = parseJsonList(commit.changedFiles);

                  return (
                    <li key={commit.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                      <div className="font-medium text-zinc-100">{commit.message}</div>
                      <div className="mt-1 text-sm text-zinc-400">
                        {commit.author} · {formatDate(commit.committedAt)}
                      </div>
                      {changedFiles.length > 0 ? (
                        <ul className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-300">
                          {changedFiles.slice(0, 5).map((file) => (
                            <li key={file} className="rounded-full border border-zinc-700 px-2 py-1">
                              {file}
                            </li>
                          ))}
                          {changedFiles.length > 5 ? (
                            <li className="rounded-full border border-zinc-700 px-2 py-1 text-zinc-500">
                              +{changedFiles.length - 5} weitere
                            </li>
                          ) : null}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>

          <Section title="Markdown-Dateien">
            {project.markdownFiles.length === 0 ? (
              <EmptyState text="Noch keine Markdown-Dateien erfasst." />
            ) : (
              <ul className="space-y-3">
                {project.markdownFiles.map((file) => (
                  <li key={file.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                    <div className="font-medium text-zinc-100">{file.title || file.path}</div>
                    <div className="mt-1 text-sm text-zinc-400">{file.path}</div>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>

        <Section title="Activity Log">
          {project.logEntries.length === 0 ? (
            <EmptyState text="Noch keine Logeinträge vorhanden." />
          ) : (
            <ul className="space-y-3">
              {project.logEntries.map((entry) => {
                const relatedDocs = parseJsonList(entry.relatedDocs);
                const changedFiles = parseJsonList(entry.changedFiles);

                return (
                  <li key={entry.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                    <div className="text-sm text-zinc-500">{formatDate(entry.date)}</div>
                    <div className="mt-1 font-medium text-zinc-100">{entry.summary}</div>

                    {relatedDocs.length > 0 ? (
                      <div className="mt-3">
                        <div className="mb-2 text-xs uppercase tracking-wide text-zinc-500">Doku betroffen</div>
                        <ul className="flex flex-wrap gap-2 text-xs text-zinc-300">
                          {relatedDocs.map((doc) => (
                            <li key={doc} className="rounded-full border border-zinc-700 px-2 py-1">
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {changedFiles.length > 0 ? (
                      <div className="mt-3 text-sm text-zinc-400">
                        {changedFiles.length} geänderte Datei{changedFiles.length === 1 ? "" : "en"}
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </Section>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="text-sm text-zinc-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-zinc-100">{value}</div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/50 p-6 text-sm text-zinc-400">
      {text}
    </div>
  );
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}
