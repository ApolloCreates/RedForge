/**
 * Single source of truth for backend configuration.
 * Override with VITE_REDFORGE_API_URL when deploying.
 */
export const API_BASE_URL =
  (import.meta.env["VITE_REDFORGE_API_URL"] as string | undefined) ?? "http://127.0.0.1:8000";

export const POLL_INTERVAL_MS = 1000;

export const TARGET_PROVIDER = "Groq";
export const TARGET_MODEL = "openai/gpt-oss-120b";
