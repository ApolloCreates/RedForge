import { ChevronDown } from "lucide-react";
import { FindingDetails } from "./FindingDetails";
import { humanize, severityClasses } from "@/lib/redforge/format";
import { cn } from "@/lib/utils";
import type { SecurityFinding } from "@/lib/redforge/types";

interface FindingCardProps {
  finding: SecurityFinding;
  expanded: boolean;
  onToggle: () => void;
}

export function FindingCard({ finding, expanded, onToggle }: FindingCardProps) {
  return (
    <div className="inset-tile overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-start gap-4 px-4 py-4 text-left transition-colors hover:bg-accent/40 sm:px-5"
      >
        <span
          className={cn(
            "font-display mt-0.5 w-20 shrink-0 rounded-full border px-2 py-1 text-center text-[10px] font-bold tracking-widest uppercase",
            severityClasses(finding.severity),
          )}
        >
          {finding.severity}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold">{finding.title}</h3>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {finding.category} • {finding.strategy}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{finding.description}</p>
        </div>

        <ChevronDown
          className={cn(
            "mt-1 size-4 shrink-0 text-muted-foreground transition-transform",
            expanded && "rotate-180",
          )}
        />
      </button>

      {expanded && <FindingDetails finding={finding} />}
    </div>
  );
}

export function findingKey(finding: SecurityFinding, index: number) {
  return finding.id ?? `${finding.category}-${finding.strategy}-${index}-${humanize(finding.title)}`;
}
