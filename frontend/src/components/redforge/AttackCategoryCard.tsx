import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttackCategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  selected: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export function AttackCategoryCard({
  title,
  description,
  icon: Icon,
  selected,
  disabled,
  onToggle,
}: AttackCategoryCardProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "inset-tile group flex h-full flex-col gap-2 p-4 text-left transition-colors",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        selected
          ? "border-primary/70 bg-primary/8"
          : "hover:border-border-strong hover:bg-accent/40",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-[4px] border",
            selected ? "border-primary bg-primary" : "border-border-strong bg-background",
          )}
        >
          {selected && <Check className="size-3 text-primary-foreground" strokeWidth={3} />}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Icon className={cn("size-4", selected ? "text-primary" : "text-muted-foreground")} />
            <span className="font-display text-sm font-semibold">{title}</span>
          </div>
          <p className="mt-1.5 text-sm leading-snug text-muted-foreground">{description}</p>
        </div>
      </div>
    </button>
  );
}
