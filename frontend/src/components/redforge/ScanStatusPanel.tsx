import { AlertTriangle, CheckCircle2, Clock, RotateCcw, ShieldQuestion, Zap } from "lucide-react";
import { formatElapsed, humanize } from "@/lib/redforge/format";
import type { ScanState, ScanStatus } from "@/lib/redforge/types";

interface ScanStatusPanelProps {
  state: ScanState | "idle";
  scan: ScanStatus | null;
  elapsedSeconds: number;
  error: string | null;
  onRetry: () => void;
}

export function ScanStatusPanel({
  state,
  scan,
  elapsedSeconds,
  error,
  onRetry,
}: ScanStatusPanelProps) {
  if (state === "idle") {
    return (
      <section className="panel flex flex-col items-center gap-2 px-5 py-10 text-center">
        <ShieldQuestion className="size-6 text-muted-foreground" />
        <h2 className="text-lg font-bold">Ready to scan</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Configure your attack categories and start a security assessment.
        </p>
      </section>
    );
  }

  if (state === "failed") {
    return (
      <section className="panel border-primary/40 p-5 lg:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 text-primary" />
            <div>
              <h2 className="text-xl font-bold">Scan Failed</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {error ?? scan?.error ?? "The security assessment stopped unexpectedly."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="font-display inline-flex h-10 shrink-0 items-center gap-2 rounded-md border border-primary/50 bg-primary/10 px-4 text-xs font-bold tracking-wide text-primary uppercase transition-colors hover:bg-primary/20"
          >
            <RotateCcw className="size-3.5" />
            Retry
          </button>
        </div>
      </section>
    );
  }

  const queued = state === "queued";
  const completed = state === "completed";
  const progress = queued ? 0 : (scan?.progress ?? 0);

  return (
    <section className="panel p-5 lg:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          {completed ? (
            <CheckCircle2 className="mt-0.5 size-5 text-success" />
          ) : (
            <Zap className="mt-0.5 size-5 animate-pulse text-primary" />
          )}
          <div>
            <h2 className="text-xl font-bold">
              {completed ? "Scan Completed" : queued ? "Scan Queued" : "Scan Running"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {completed
                ? "The security assessment finished. Review the report below."
                : queued
                  ? "Preparing security assessment..."
                  : "RedForge is testing the target..."}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <p className="label-caps flex items-center gap-1.5 sm:justify-end">
            <Clock className="size-3.5" />
            Elapsed Time
          </p>
          <p className="mt-1 font-mono text-lg font-semibold">{formatElapsed(elapsedSeconds)}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
          <div
            className={
              completed
                ? "h-full rounded-full bg-success transition-[width] duration-500"
                : "h-full rounded-full bg-primary transition-[width] duration-500"
            }
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
        <span className="font-mono text-sm font-semibold">{Math.round(progress)}%</span>
      </div>

      <dl className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-3 sm:divide-x sm:divide-border">
        <div className="sm:pr-4">
          <dt className="label-caps">Completed Attempts</dt>
          <dd className="mt-1.5 font-mono text-lg font-semibold">
            {scan?.completed_attempts ?? 0} / {scan?.total_attempts ?? 0}
          </dd>
        </div>
        <div className="sm:px-4">
          <dt className="label-caps">Current Category</dt>
          <dd className="mt-1.5 text-lg font-semibold">{humanize(scan?.current_category)}</dd>
        </div>
        <div className="sm:px-4">
          <dt className="label-caps">Current Strategy</dt>
          <dd className="mt-1.5 text-lg font-semibold">{humanize(scan?.current_strategy)}</dd>
        </div>
      </dl>
    </section>
  );
}
