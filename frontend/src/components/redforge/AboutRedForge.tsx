import { Check, Flame } from "lucide-react";

const FEATURES = [
  "Adversarial Testing",
  "Adaptive Attacks",
  "LLM-as-a-Judge",
  "Security Findings",
  "Detailed Reporting",
];

export function AboutRedForge() {
  return (
    <section className="panel p-5">
      <div className="flex items-center gap-2.5">
        <Flame className="size-4 text-primary" />
        <h2 className="font-display text-sm font-bold tracking-widest uppercase">
          About RedForge
        </h2>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        An open-source LLM security testing framework for building safer AI systems.
      </p>

      <ul className="mt-4 space-y-2">
        {FEATURES.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5 text-sm">
            <Check className="size-3.5 shrink-0 text-primary" strokeWidth={3} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center gap-3 rounded-md border border-primary/30 bg-primary/8 px-4 py-4">
        <Flame className="size-6 shrink-0 text-primary" strokeWidth={2.2} />
        <p className="font-display text-xs leading-relaxed font-bold tracking-widest text-primary uppercase">
          Stronger AI
          <br />
          Through Adversity
        </p>
      </div>
    </section>
  );
}
