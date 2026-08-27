import type { AttackCategoryId, FindingSeverity } from "./types";

export function humanize(value?: string | null): string {
  if (!value) return "—";
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export function formatScanDate(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: iso, time: "" };
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  };
}

export const SEVERITY_ORDER: FindingSeverity[] = ["critical", "high", "medium", "low"];

export const CATEGORY_ORDER: AttackCategoryId[] = [
  "system_prompt_extraction",
  "prompt_injection",
  "jailbreak",
];

export function severityClasses(severity: FindingSeverity): string {
  switch (severity) {
    case "critical":
      return "border-primary/60 bg-primary/20 text-primary";
    case "high":
      return "border-primary/40 bg-primary/12 text-primary";
    case "medium":
      return "border-warning/40 bg-warning/12 text-warning";
    default:
      return "border-info/40 bg-info/12 text-info";
  }
}
