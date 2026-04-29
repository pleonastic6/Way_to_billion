"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AddProjectForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [repoPath, setRepoPath] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, repoPath, description: description || undefined }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Projekt konnte nicht angelegt werden.");
      }

      const project = await response.json();
      router.push(`/projects/${project.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300" htmlFor="name">
          Projektname
        </label>
        <input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="z. B. SAP Projekt"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none ring-0 placeholder:text-zinc-500 focus:border-zinc-500"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300" htmlFor="repoPath">
          Lokaler Repo-Pfad
        </label>
        <input
          id="repoPath"
          value={repoPath}
          onChange={(event) => setRepoPath(event.target.value)}
          placeholder="/root/.openclaw/workspace/dein-repo"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none ring-0 placeholder:text-zinc-500 focus:border-zinc-500"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300" htmlFor="description">
          Beschreibung
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Kurze Beschreibung des Projekts"
          rows={4}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none ring-0 placeholder:text-zinc-500 focus:border-zinc-500"
        />
      </div>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Lege an…" : "Projekt anlegen"}
      </button>
    </form>
  );
}
