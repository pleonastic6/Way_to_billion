export function extractFirstHeading(content: string) {
  const line = content
    .split("\n")
    .find((entry) => entry.trim().startsWith("# "));

  return line ? line.replace(/^#\s+/, "").trim() : null;
}
