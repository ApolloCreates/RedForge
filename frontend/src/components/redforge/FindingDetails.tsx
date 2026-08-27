import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SecurityFinding } from "@/lib/redforge/types";

function Block({ title, body }: { title: string; body?: string | undefined }) {
  if (!body) return null;
  return (
    <div>
      <p className="label-caps">{title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{body}</p>
    </div>
  );
}

function CodeDisclosure({ title, body }: { title: string; body?: string | undefined }) {
  const [open, setOpen] = useState(false);
  if (!body) return null;

  return (
    <div className="inset-tile overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition-colors hover:bg-accent/40"
      >
        <span className="label-caps">{title}</span>
        <ChevronDown
          className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <pre className="max-h-64 overflow-auto border-t border-border bg-background px-3 py-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground/85">
          {body}
        </pre>
      )}
    </div>
  );
}

export function FindingDetails({ finding }: { finding: SecurityFinding }) {
  return (
    <div className="space-y-4 border-t border-border bg-surface/60 px-4 py-4 sm:px-5">
      <Block title="Description" body={finding.description} />
      <Block title="Evidence" body={finding.evidence} />
      <Block title="Recommendation" body={finding.recommendation} />

      <div>
        <p className="label-caps">Technical Details</p>
        <div className="mt-2 space-y-2">
          <CodeDisclosure title="Attack Prompt" body={finding.attack_prompt} />
          <CodeDisclosure title="Target Response" body={finding.target_response} />
          <Block title="Judge Evidence" body={finding.judge_evidence} />
          <Block title="Judge Reason" body={finding.judge_reason} />
        </div>
      </div>
    </div>
  );
}
