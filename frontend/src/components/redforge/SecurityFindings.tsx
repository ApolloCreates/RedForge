import { useMemo, useState } from "react";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { FindingCard, findingKey } from "./FindingCard";
import { SEVERITY_ORDER } from "@/lib/redforge/format";
import type { FindingSeverity, SecurityFinding } from "@/lib/redforge/types";
import { cn } from "@/lib/utils";

interface SecurityFindingsProps {
  findings: SecurityFinding[];
}

export function SecurityFindings({ findings }: SecurityFindingsProps) {
  const [filter, setFilter] = useState<FindingSeverity | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? findings : findings.filter((f) => f.severity === filter)),
    [findings, filter],
  );

  return (
    <section className="panel p-5 lg:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 size-5 text-primary" />
          <div>
            <h2 className="text-xl font-bold">Security Findings</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Potential vulnerabilities discovered during the security assessment.
            </p>
          </div>
        </div>

        {findings.length > 0 && (
          <div className="inset-tile flex shrink-0 gap-1 p-1">
            {(["all", ...SEVERITY_ORDER] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={cn(
                  "font-display rounded-[4px] px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase transition-colors",
                  filter === value
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {value}
              </button>
            ))}
          </div>
        )}
      </div>

      {findings.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 py-10 text-center">
          <ShieldCheck className="size-6 text-success" />
          <h3 className="text-lg font-bold">No Security Findings</h3>
          <p className="max-w-lg text-sm text-muted-foreground">
            RedForge completed the assessment without identifying successful or partial security
            boundary violations.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {visible.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No findings at this severity.
            </p>
          ) : (
            visible.map((finding, index) => {
              const key = findingKey(finding, index);
              return (
                <FindingCard
                  key={key}
                  finding={finding}
                  expanded={expanded === key}
                  onToggle={() => setExpanded(expanded === key ? null : key)}
                />
              );
            })
          )}
        </div>
      )}
    </section>
  );
}
