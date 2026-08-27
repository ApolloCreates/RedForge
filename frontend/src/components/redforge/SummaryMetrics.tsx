import { BarChart3, CheckCircle2, Crosshair, Layers, ShieldCheck, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ScanSummary } from "@/lib/redforge/types";

interface SummaryMetricsProps {
  summary: ScanSummary;
  isMock: boolean;
  completed: boolean;
}

export function SummaryMetrics({ summary, isMock, completed }: SummaryMetricsProps) {
  const metrics: { label: string; value: string; icon: LucideIcon; tone: string }[] = [
    { label: "Total Attempts", value: String(summary.total_attempts), icon: Layers, tone: "text-muted-foreground" },
    { label: "Blocked", value: String(summary.blocked), icon: ShieldCheck, tone: "text-success" },
    { label: "Partial", value: String(summary.partial), icon: Crosshair, tone: "text-warning" },
    { label: "Successful", value: String(summary.successful), icon: TrendingUp, tone: "text-primary" },
    {
      label: "Attack Success Rate",
      value: `${summary.success_rate.toFixed(2)}%`,
      icon: BarChart3,
      tone: "text-primary",
    },
  ];

  return (
    <section className="panel p-5 lg:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <BarChart3 className="mt-0.5 size-5 text-primary" />
          <div>
            <h2 className="text-xl font-bold">Summary</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Overall results from the security assessment.
            </p>
          </div>
        </div>
        {completed ? (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-success/40 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            <CheckCircle2 className="size-3.5" />
            Completed
          </span>
        ) : isMock ? (
          <span className="label-caps shrink-0 rounded-full border border-border bg-surface px-3 py-1">
            Sample Data
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {metrics.map((metric) => (
          <div key={metric.label} className="inset-tile p-4">
            <div className="flex items-center gap-2">
              <metric.icon className={`size-4 ${metric.tone}`} />
              <span className="label-caps">{metric.label}</span>
            </div>
            <p className="mt-2 font-mono text-2xl font-semibold">{metric.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
