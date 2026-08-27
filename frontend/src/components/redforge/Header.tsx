import { Flame, Zap } from "lucide-react";
import { TARGET_MODEL, TARGET_PROVIDER } from "@/lib/redforge/config";

interface HeaderProps {
  backendHealthy: boolean | null;
}

export function Header({ backendHealthy }: HeaderProps) {
  const statusLabel =
    backendHealthy === null ? "Checking" : backendHealthy ? "Ready" : "Unreachable";

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-md border border-primary/30 bg-primary/10">
            <Flame className="size-6 text-primary" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="font-display text-2xl leading-none font-extrabold tracking-tight">
              <span className="text-primary">RED</span>
              <span className="text-foreground">FORGE</span>
            </h1>
            <p className="label-caps mt-1.5">LLM Security Testing</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-3">
            <span className="label-caps">Target Provider</span>
            <div className="inset-tile flex items-center gap-2 px-3 py-2">
              <Zap className="size-3.5 text-primary" />
              <span className="text-sm font-semibold">{TARGET_PROVIDER}</span>
              <span className="font-mono text-[11px] text-muted-foreground">{TARGET_MODEL}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={
                backendHealthy === false
                  ? "size-2 rounded-full bg-primary"
                  : backendHealthy === null
                    ? "size-2 rounded-full bg-muted-foreground"
                    : "size-2 rounded-full bg-success"
              }
            />
            <span
              className={
                backendHealthy === false
                  ? "text-sm font-medium text-primary"
                  : backendHealthy === null
                    ? "text-sm font-medium text-muted-foreground"
                    : "text-sm font-medium text-success"
              }
            >
              {statusLabel}
            </span>
          </div>

          <p className="label-caps hidden xl:block">Find weaknesses. Build stronger AI.</p>
        </div>
      </div>
    </header>
  );
}
