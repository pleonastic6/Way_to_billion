import Link from "next/link";
import { AddProjectForm } from "@/components/projects/AddProjectForm";

export default function NewProjectPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <div>
          <Link href="/" className="text-sm text-zinc-400 transition hover:text-zinc-200">
            ← Zurück zum Dashboard
          </Link>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Neues Projekt anlegen
          </h1>
          <p className="mt-3 text-zinc-400">
            Hinterlege hier ein lokales Repository, damit die App Struktur,
            Markdown-Dateien und Commits einlesen kann.
          </p>
        </div>

        <AddProjectForm />
      </div>
    </main>
  );
}
