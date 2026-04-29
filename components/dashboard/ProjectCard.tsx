import Link from "next/link";

type ProjectCardProps = {
  project: {
    id: string;
    name: string;
    description: string | null;
    updatedAt: Date;
    markdownCount: number;
    commitCount: number;
    latestLog: string | null;
  };
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-zinc-700 hover:bg-zinc-800"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">{project.name}</h2>
          <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
            {project.description || "Keine Beschreibung vorhanden."}
          </p>
        </div>
        <span className="rounded-lg bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
          {project.markdownCount} MD
        </span>
      </div>

      <div className="grid gap-3 text-sm text-zinc-400 sm:grid-cols-2">
        <div>
          <span className="block text-zinc-500">Commits</span>
          <span>{project.commitCount}</span>
        </div>
        <div>
          <span className="block text-zinc-500">Aktualisiert</span>
          <span>
            {new Intl.DateTimeFormat("de-DE", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(project.updatedAt)}
          </span>
        </div>
      </div>

      <div className="mt-4 border-t border-zinc-800 pt-4 text-sm text-zinc-400">
        <span className="block text-zinc-500">Letzter Log</span>
        <span className="line-clamp-2">
          {project.latestLog || "Noch kein Logeintrag vorhanden."}
        </span>
      </div>
    </Link>
  );
}
