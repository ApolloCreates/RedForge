export type AttackCategoryId = "system_prompt_extraction" | "prompt_injection" | "jailbreak";

export type ScanState = "queued" | "running" | "completed" | "failed";

export type FindingSeverity = "critical" | "high" | "medium" | "low";

export interface ScanRequest {
  categories: AttackCategoryId[];
  max_attempts_per_strategy: number;
}

export interface StartScanResponse {
  scan_id: string;
  status: ScanState;
}

export interface HealthResponse {
  status: string;
}

export interface ScanSummary {
  total_attempts: number;
  successful: number;
  partial: number;
  blocked: number;
  success_rate: number;
}

export interface CategoryResult {
  attempts: number;
  successful: number;
  partial: number;
  blocked: number;
  success_rate: number;
}

export interface SecurityFinding {
  id?: string;
  severity: FindingSeverity;
  title: string;
  category: string;
  strategy: string;
  description: string;
  evidence?: string;
  recommendation?: string;
  attack_prompt?: string;
  target_response?: string;
  judge_evidence?: string;
  judge_reason?: string;
}

export interface SecurityReport {
  metadata: Record<string, unknown>;
  summary: ScanSummary;
  categories: Record<string, CategoryResult>;
  findings: SecurityFinding[];
}

export interface ScanStatus {
  id: string;
  status: ScanState;
  progress: number;
  completed_attempts: number;
  total_attempts: number;
  current_category: string | null;
  current_strategy: string | null;
  report: SecurityReport | null;
  error: string | null;
}

export interface ScanHistoryItem {
  id: string;
  status: ScanState;
  progress: number;
  completed_attempts: number;
  total_attempts: number;
  created_at: string;
  completed_at: string | null;
}

export interface ScanHistoryResponse {
  scans: ScanHistoryItem[];
}
