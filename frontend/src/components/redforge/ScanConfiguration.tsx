import { KeyRound, Layers, Play, ShieldOff, SquareTerminal, Loader2 } from "lucide-react";
import { AttackCategoryCard } from "./AttackCategoryCard";
import type { AttackCategoryId, ScanState } from "@/lib/redforge/types";
import { cn } from "@/lib/utils";

const CATEGORIES: {
  id: AttackCategoryId;
  title: string;
  description: string;
  icon: typeof KeyRound;
}[] = [
  {
    id: "system_prompt_extraction",
    title: "System Prompt Extraction",
    description: "Test whether the model reveals hidden system instructions.",
    icon: SquareTerminal,
  },
  {
    id: "prompt_injection",
    title: "Prompt Injection",
    description: "Test whether untrusted instructions can override intended behavior.",
    icon: KeyRound,
  },
  {
    id: "jailbreak",
    title: "Jailbreak",
    description: "Test whether the model can be induced to bypass its safety behavior.",
    icon: ShieldOff,
  },
];

interface ScanConfigurationProps {
  selected: AttackCategoryId[];
  onToggleCategory: (id: AttackCategoryId) => void;
  attempts: number;
  onAttemptsChange: (value: number) => void;
  state: ScanState | "idle";
  onStart: () => void;
}

export function ScanConfiguration({
  selected,
  onToggleCategory,
  attempts,
  onAttemptsChange,
  state,
  onStart,
}: ScanConfigurationProps) {
  const busy = state === "queued" || state === "running";
  const label = busy
    ? "Scan Running..."
    : state === "completed" || state === "failed"
      ? "Run New Scan"
      : "Start Red Team Scan";

  return (
    <section className="panel p-5 lg:p-6">
      <div className="flex items-start gap-3">
        <Layers className="mt-0.5 size-5 text-primary" />
        <div>
          <h2 className="text-xl font-bold">Configure Scan</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Select attack categories and settings to test your model against adversarial attacks.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <p className="label-caps">Attack Categories</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {CATEGORIES.map((category) => (
            <AttackCategoryCard
              key={category.id}
              title={category.title}
              description={category.description}
              icon={category.icon}
              disabled={busy}
              selected={selected.includes(category.id)}
              onToggle={() => onToggleCategory(category.id)}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-5 border-t border-border pt-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xs">
          <label htmlFor="attempts" className="label-caps block">
            Attempts per Strategy
          </label>
          <input
            id="attempts"
            type="number"
            min={1}
            max={20}
            value={attempts}
            disabled={busy}
            onChange={(event) => onAttemptsChange(Number(event.target.value))}
            className="inset-tile mt-2 h-11 w-32 px-3 font-mono text-base text-foreground focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none disabled:opacity-60"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Number of attempts for each attack strategy.
          </p>
        </div>

        <button
          type="button"
          onClick={onStart}
          disabled={busy || selected.length === 0}
          className={cn(
            "font-display inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 text-sm font-bold tracking-wide uppercase transition-colors",
            "bg-primary text-primary-foreground shadow-[var(--shadow-ember)] hover:bg-primary/90",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none",
          )}
        >
          {busy ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Play className="size-4 fill-current" />
          )}
          {label}
        </button>
      </div>
    </section>
  );
}
