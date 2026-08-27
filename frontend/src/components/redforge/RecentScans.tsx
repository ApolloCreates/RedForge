import { useEffect, useState } from "react";
import { ChevronRight, History, Loader2 } from "lucide-react";
import { formatScanDate } from "@/lib/redforge/format";
import type { ScanHistoryItem } from "@/lib/redforge/types";
import { cn } from "@/lib/utils";

interface RecentScansProps {
  scans: ScanHistoryItem[];
  activeScanId: string | null;
  loadingScanId: string | null;
  isMock: boolean;
  onSelect: (scan: ScanHistoryItem) => void;
}

const STATUS_TONE: Record<
  string,
  { dot: string; text: string; label: string }
> = {
  completed: {
    dot: "bg-success",
    text: "text-success",
    label: "Completed",
  },
  failed: {
    dot: "bg-primary",
    text: "text-primary",
    label: "Failed",
  },
  running: {
    dot: "bg-warning",
    text: "text-warning",
    label: "Running",
  },
  queued: {
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
    label: "Queued",
  },
};

export function RecentScans({
  scans,
  activeScanId,
  loadingScanId,
  isMock,
  onSelect,
}: RecentScansProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="panel p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <History className="size-4 text-primary" />

          <h2 className="font-display text-sm font-bold tracking-widest uppercase">
            Recent Scans
          </h2>
        </div>

        {isMock && <span className="label-caps">Sample</span>}
      </div>

      {scans.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No scans recorded yet.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {scans.map((scan) => {
            const tone =
              STATUS_TONE[scan.status] ?? STATUS_TONE["queued"]!;

            const formattedDate = mounted
              ? formatScanDate(scan.created_at)
              : { date: "—", time: "—" };

            const selectable = scan.status === "completed";

            return (
              <li key={scan.id}>
                <button
                  type="button"
                  disabled={!selectable}
                  onClick={() => onSelect(scan)}
                  className={cn(
                    "-mx-2 flex w-[calc(100%+1rem)] items-center gap-3 rounded-md px-2 py-3 text-left transition-colors",
                    selectable
                      ? "hover:bg-accent/40"
                      : "cursor-default",
                    activeScanId === scan.id && "bg-primary/8",
                  )}
                >
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      tone.dot,
                    )}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs text-muted-foreground">
                      {formattedDate.date} {formattedDate.time}
                    </p>

                    <p
                      className={cn(
                        "mt-0.5 text-sm font-semibold",
                        tone.text,
                      )}
                    >
                      {tone.label}
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {scan.completed_attempts}/{scan.total_attempts} attempts
                    </p>
                  </div>

                  {loadingScanId === scan.id ? (
                    <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
                  ) : (
                    selectable && (
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    )
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}