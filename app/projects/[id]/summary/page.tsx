import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { buildProjectSummary } from "@/lib/project-summary";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectSummaryPage({ params }: PageProps) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      markdownFiles: true,
      commits: {
        orderBy: { committedAt: "desc" },
        take: 10,
      },
      logEntries: {
        orderBy: { date: "desc" },
        take: 10,
      },
    },
  });

  if (!project) notFound();

  const summary = buildProjectSummary(project);

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <div>
          <Link href={`/projects/${project.id}`} className="text-sm text-zinc-400 transition hover:text-zinc-200">
            ← Zurück zum Projekt
          </Link>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Summary · {project.name}</h1>
          <p className="mt-3 text-zinc-400">
            Diese Ansicht verdichtet Commit-, Markdown- und Log-Daten zu einer Vorlage für Doku, Bericht oder Abgabe.
          </p>
        </div>

        <Card title="Aktueller Stand">
          <p className="text-zinc-300">{summary.intro}</p>
          <p className="mt-4 text-zinc-400">
            In den zuletzt eingelesenen Commits wurden insgesamt <strong className="text-zinc-200">{summary.changedFileCount}</strong> Dateien geändert.
          </p>
        </Card>

        <Card title="Kurztext für Dokumentation">
          <div className="rounded-2xl bg-zinc-950 p-4 text-zinc-300">
            <p>
              Im aktuellen Projektstand wurden zuletzt mehrere Änderungen am Repository vorgenommen. Dabei lag der Fokus auf {summary.touchedDocs.length > 0 ? "der begleitenden Markdown-Dokumentation sowie der Projektstruktur" : "der Projektstruktur und dem technischen Aufbau"}. Relevante Arbeitsschritte wurden bereits im Activity Log erfasst und können als Grundlage für die weitere Projektdokumentation verwendet werden.
            </p>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Letzte Commits">
            {summary.recentCommitMessages.length === 0 ? (
              <Empty text="Noch keine Commits vorhanden." />
            ) : (
              <ul className="list-disc space-y-2 pl-5 text-zinc-300">
                {summary.recentCommitMessages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Zuletzt relevante Doku-Dateien">
            {summary.recentDocs.length === 0 ? (
              <Empty text="Noch keine Markdown-Dateien erfasst." />
            ) : (
              <ul className="list-disc space-y-2 pl-5 text-zinc-300">
                {summary.recentDocs.map((doc) => (
                  <li key={doc}>{doc}</li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <Card title="Doku-Kontext aus dem Activity Log">
          {summary.touchedDocs.length === 0 ? (
            <Empty text="Bisher wurden in den eingelesenen Logs keine Doku-Dateien erkannt." />
          ) : (
            <ul className="flex flex-wrap gap-2 text-sm text-zinc-300">
              {summary.touchedDocs.map((doc) => (
                <li key={doc} className="rounded-full border border-zinc-700 px-3 py-1">
                  {doc}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-sm text-zinc-500">{text}</p>;
}
