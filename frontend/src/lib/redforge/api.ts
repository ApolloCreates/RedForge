import { API_BASE_URL } from "./config";
import type {
  HealthResponse,
  ScanHistoryResponse,
  ScanRequest,
  ScanStatus,
  StartScanResponse,
} from "./types";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!response.ok) {
    let detail = `${response.status} ${response.statusText}`;
    try {
      const body = (await response.json()) as { detail?: string };
      if (body?.detail) detail = body.detail;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(detail);
  }

  return (await response.json()) as T;
}

export function getHealth(): Promise<HealthResponse> {
  return request<HealthResponse>("/api/health");
}

export function startScan(payload: ScanRequest): Promise<StartScanResponse> {
  return request<StartScanResponse>("/api/scans", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getScan(scanId: string): Promise<ScanStatus> {
  return request<ScanStatus>(`/api/scans/${scanId}`);
}

export function getScans(): Promise<ScanHistoryResponse> {
  return request<ScanHistoryResponse>("/api/scans");
}
