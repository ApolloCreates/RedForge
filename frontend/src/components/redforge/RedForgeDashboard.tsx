import { useCallback, useEffect, useRef, useState } from "react";
import { Header } from "./Header";
import { ScanConfiguration } from "./ScanConfiguration";
import { ScanStatusPanel } from "./ScanStatusPanel";
import { SummaryMetrics } from "./SummaryMetrics";
import { CategoryAnalysis } from "./CategoryAnalysis";
import { SecurityFindings } from "./SecurityFindings";
import { RecentScans } from "./RecentScans";
import { AboutRedForge } from "./AboutRedForge";
import { getHealth, getScan, getScans, startScan } from "@/lib/redforge/api";
import { POLL_INTERVAL_MS } from "@/lib/redforge/config";
import { MOCK_HISTORY, MOCK_REPORT } from "@/lib/redforge/mock";
import { CATEGORY_ORDER } from "@/lib/redforge/format";
import type {
  AttackCategoryId,
  ScanHistoryItem,
  ScanState,
  ScanStatus,
  SecurityReport,
} from "@/lib/redforge/types";

export function RedForgeDashboard() {
  const [categories, setCategories] = useState<AttackCategoryId[]>(CATEGORY_ORDER.slice(0, 1));
  const [attempts, setAttempts] = useState(2);

  const [state, setState] = useState<ScanState | "idle">("idle");
  const [scan, setScan] = useState<ScanStatus | null>(null);
  const [report, setReport] = useState<SecurityReport>(MOCK_REPORT);
  const [reportIsMock, setReportIsMock] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const [history, setHistory] = useState<ScanHistoryItem[]>(MOCK_HISTORY);
  const [historyIsMock, setHistoryIsMock] = useState(true);
  const [loadingScanId, setLoadingScanId] = useState<string | null>(null);
  const [activeScanId, setActiveScanId] = useState<string | null>(null);
  const [backendHealthy, setBackendHealthy] = useState<boolean | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current !== null) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const refreshHistory = useCallback(async () => {
    try {
      const data = await getScans();
      setHistory(data.scans);
      setHistoryIsMock(false);
    } catch {
      /* backend unavailable: keep whatever history is on screen */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    getHealth()
      .then((res) => {
        if (!cancelled) setBackendHealthy(res.status === "healthy");
      })
      .catch(() => {
        if (!cancelled) setBackendHealthy(false);
      });
    void refreshHistory();
    return () => {
      cancelled = true;
    };
  }, [refreshHistory]);

  useEffect(() => stopPolling, [stopPolling]);

  // Elapsed-time ticker, only while a scan is in flight.
  useEffect(() => {
    if (state !== "queued" && state !== "running") return;
    const timer = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [state]);

  const beginPolling = useCallback(
    (scanId: string) => {
      stopPolling();
      pollRef.current = setInterval(async () => {
        try {
          const next = await getScan(scanId);
          setScan(next);
          setState(next.status);

          if (next.status === "completed") {
            stopPolling();
            if (next.report) {
              setReport(next.report);
              setReportIsMock(false);
            }
            void refreshHistory();
          } else if (next.status === "failed") {
            stopPolling();
            setError(next.error ?? "The scan failed on the backend.");
            void refreshHistory();
          }
        } catch (err) {
          stopPolling();
          setState("failed");
          setError(err instanceof Error ? err.message : "Lost connection to the RedForge backend.");
        }
      }, POLL_INTERVAL_MS);
    },
    [refreshHistory, stopPolling],
  );

  const handleStart = useCallback(async () => {
    if (categories.length === 0) return;
    stopPolling();
    setError(null);
    setElapsed(0);
    setScan(null);
    setState("queued");

    try {
      const { scan_id } = await startScan({
        categories,
        max_attempts_per_strategy: attempts,
      });
      setActiveScanId(scan_id);
      setBackendHealthy(true);
      beginPolling(scan_id);
    } catch (err) {
      setState("failed");
      setError(
        err instanceof Error
          ? `Could not start the scan: ${err.message}`
          : "Could not start the scan.",
      );
      setBackendHealthy(false);
    }
  }, [attempts, beginPolling, categories, stopPolling]);

  const handleSelectHistoryScan = useCallback(
    async (item: ScanHistoryItem) => {
      if (item.status !== "completed") return;
      stopPolling();
      setLoadingScanId(item.id);
      try {
        const detail = await getScan(item.id);
        setScan(detail);
        setState(detail.status);
        setActiveScanId(detail.id);
        setElapsed(0);
        setError(detail.error);
        if (detail.report) {
          setReport(detail.report);
          setReportIsMock(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load that scan report.");
        setState("failed");
      } finally {
        setLoadingScanId(null);
      }
    },
    [stopPolling],
  );

  const toggleCategory = (id: AttackCategoryId) =>
    setCategories((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );

  const showReport = state === "idle" || state === "completed";

  return (
    <div className="min-h-screen bg-background">
      <Header backendHealthy={backendHealthy} />

      <main className="mx-auto grid max-w-[1500px] gap-5 px-5 py-6 lg:grid-cols-[minmax(0,3fr)_minmax(260px,1fr)] lg:px-8 lg:py-8">
        <div className="space-y-5">
          <ScanConfiguration
            selected={categories}
            onToggleCategory={toggleCategory}
            attempts={attempts}
            onAttemptsChange={(value) => setAttempts(Math.min(20, Math.max(1, value || 1)))}
            state={state}
            onStart={() => void handleStart()}
          />

          <ScanStatusPanel
            state={state}
            scan={scan}
            elapsedSeconds={elapsed}
            error={error}
            onRetry={() => void handleStart()}
          />

          {showReport && (
            <>
              <SummaryMetrics
                summary={report.summary}
                isMock={reportIsMock}
                completed={state === "completed"}
              />
              <CategoryAnalysis categories={report.categories} />
              <SecurityFindings findings={report.findings} />
            </>
          )}
        </div>

        <aside className="space-y-5">
          <RecentScans
            scans={history}
            activeScanId={activeScanId}
            loadingScanId={loadingScanId}
            isMock={historyIsMock}
            onSelect={(item) => void handleSelectHistoryScan(item)}
          />
          <AboutRedForge />
        </aside>
      </main>
    </div>
  );
}
