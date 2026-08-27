import { createFileRoute } from "@tanstack/react-router";
import { RedForgeDashboard } from "@/components/redforge/RedForgeDashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RedForge — LLM Security Testing Console" },
      {
        name: "description",
        content:
          "RedForge red-teams language models with adversarial prompts, adaptive attacks and an LLM-as-a-Judge evaluator, then reports every security finding.",
      },
      { property: "og:title", content: "RedForge — LLM Security Testing Console" },
      {
        property: "og:description",
        content:
          "Configure a red team scan, watch live progress and inspect LLM security findings from one console.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RedForgeDashboard,
});
