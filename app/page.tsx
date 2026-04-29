export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <div className="space-y-4">
          <span className="inline-flex rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-zinc-400">
            Repo overview + project documentation
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Way to Billion
          </h1>
          <p className="max-w-2xl text-lg text-zinc-400">
            Eine Web-App für kleine Projektteams, die Repositories übersichtlich
            macht, Markdown-Dokumentation verfolgt und Fortschritt strukturiert
            festhält.
          </p>
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

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h2 className="mb-3 text-xl font-medium">Nächste sinnvolle Schritte</h2>
          <ol className="list-decimal space-y-2 pl-5 text-zinc-300">
            <li>Projektmodell und SQLite/Prisma anbinden</li>
            <li>Repos lokal hinzufügen und scannen</li>
            <li>Markdown-Dateien und letzte Commits anzeigen</li>
            <li>Activity Log und Summary-Ansicht bauen</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
