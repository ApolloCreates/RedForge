import { Target } from "lucide-react";
import { CATEGORY_ORDER, humanize } from "@/lib/redforge/format";
import type { CategoryResult } from "@/lib/redforge/types";

interface CategoryAnalysisProps {
  categories: Record<string, CategoryResult>;
}

export function CategoryAnalysis({ categories }: CategoryAnalysisProps) {
  const keys = Object.keys(categories).sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a as never);
    const bi = CATEGORY_ORDER.indexOf(b as never);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <section className="panel p-5 lg:p-6">
      <div className="flex items-start gap-3">
        <Target className="mt-0.5 size-5 text-primary" />
        <div>
          <h2 className="text-xl font-bold">Attack Categories</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Outcome breakdown per attack category.
          </p>
        </div>
      </div>

      {keys.length === 0 ? (
        <p className="mt-5 text-sm text-muted-foreground">No category results in this report.</p>
      ) : (
        <div className="mt-5 space-y-3">
          {keys.map((key) => {
            const row = categories[key]!;
            const total = Math.max(1, row.attempts);
            const segments = [
              { value: row.blocked, className: "bg-success" },
              { value: row.partial, className: "bg-warning" },
              { value: row.successful, className: "bg-primary" },
            ];

            return (
              <div key={key} className="inset-tile p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{humanize(key)}</h3>
                  <div className="flex items-center gap-2">
                    <span className="label-caps">Success Rate</span>
                    <span className="font-mono text-sm font-semibold text-primary">
                      {(row.success_rate ?? 0).toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex h-1.5 gap-0.5 overflow-hidden rounded-full bg-background">
                  {segments.map((segment, index) => (
                    <div
                      key={index}
                      className={segment.className}
                      style={{ width: `${(segment.value / total) * 100}%` }}
                    />
                  ))}
                </div>

                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
                  {[
                    { label: "Attempts", value: row.attempts, tone: "text-foreground" },
                    { label: "Successful", value: row.successful, tone: "text-primary" },
                    { label: "Partial", value: row.partial, tone: "text-warning" },
                    { label: "Blocked", value: row.blocked, tone: "text-success" },
                  ].map((cell) => (
                    <div key={cell.label} className="flex items-center justify-between gap-2">
                      <dt className="label-caps">{cell.label}</dt>
                      <dd className={`font-mono text-sm font-semibold ${cell.tone}`}>
                        {cell.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
