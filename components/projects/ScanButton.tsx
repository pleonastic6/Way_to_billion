"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ScanButtonProps = {
  projectId: string;
};

export function ScanButton({ projectId }: ScanButtonProps) {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleScan() {
    setIsScanning(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/scan`, {
        method: "POST",
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error || "Scan fehlgeschlagen.");
      }

      setMessage(
        `${payload.markdownCount} Markdown-Dateien und ${payload.commitCount} Commits eingelesen.`,
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setIsScanning(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleScan}
        disabled={isScanning}
        className="inline-flex rounded-xl bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isScanning ? "Scanne…" : "Repo scannen"}
      </button>

      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
    </div>
  );
}
