"use client";

import { useState } from "react";
import Link from "next/link";
import { Rocket, TrendingUp, Crown, RotateCcw, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PricingTier } from "@/lib/content";

type TierKey = "launch" | "growth" | "scale";

const TIER_ICONS: Record<TierKey, LucideIcon> = {
  launch: Rocket,
  growth: TrendingUp,
  scale: Crown,
};

type Question = {
  question: string;
  options: { label: string; tier: TierKey }[];
};

const QUESTIONS: Question[] = [
  {
    question: "Where are you starting from?",
    options: [
      { label: "I don't have a website or store yet — I need one live fast.", tier: "launch" },
      { label: "I have one, but it isn't converting or growing like it should.", tier: "growth" },
      { label: "I have a working site and want a long-term growth partner.", tier: "scale" },
    ],
  },
  {
    question: "How many pages or products will you need?",
    options: [
      { label: "Just the essentials — under 20 pages or products.", tier: "launch" },
      { label: "A growing catalog — up to about 100.", tier: "growth" },
      { label: "A large or unlimited catalog.", tier: "scale" },
    ],
  },
  {
    question: "What matters most right now?",
    options: [
      { label: "Getting live quickly, on a budget.", tier: "launch" },
      { label: "SEO, speed, and conversion improvements.", tier: "growth" },
      { label: "Ongoing strategy, automation, and priority support.", tier: "scale" },
    ],
  },
  {
    question: "How much support do you want after launch?",
    options: [
      { label: "A clean handoff — I'll take it from there.", tier: "launch" },
      { label: "Some support while I keep growing (about a month).", tier: "growth" },
      { label: "A long-term partnership with strategy calls.", tier: "scale" },
    ],
  },
];

function computeRecommendedTier(answers: TierKey[]): TierKey {
  const tally: Record<TierKey, number> = { launch: 0, growth: 0, scale: 0 };
  for (const tier of answers) tally[tier] += 1;

  let winner: TierKey = "growth";
  let best = -1;
  for (const tier of ["launch", "growth", "scale"] as TierKey[]) {
    // On a tie, prefer growth (the flagship/most-chosen middle option).
    if (tally[tier] > best || (tally[tier] === best && tier === "growth")) {
      best = tally[tier];
      winner = tier;
    }
  }
  return winner;
}

export function PricingQuiz({ tiers }: { tiers: PricingTier[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<TierKey[]>([]);

  const isDone = step >= QUESTIONS.length;

  const handleAnswer = (tier: TierKey) => {
    setAnswers((prev) => [...prev.slice(0, step), tier]);
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers([]);
  };

  if (isDone) {
    const recommendedKey = computeRecommendedTier(answers);
    const tier = tiers.find((t) => t.key === recommendedKey) ?? tiers[0];
    const Icon = TIER_ICONS[recommendedKey];

    return (
      <Card className="mx-auto max-w-xl border-2 border-brand p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">
          <Icon className="h-6 w-6 text-brand" />
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand">
          Recommended For You
        </p>
        <h3 className="mt-1 text-2xl font-bold text-ink">{tier.name}</h3>
        <p className="mt-2 text-sm text-muted">{tier.tagline}</p>

        <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm">
          {tier.features.slice(0, 4).map((feature) => (
            <li key={feature} className="text-muted">
              • {feature}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/contact">{tier.cta} →</Link>
          </Button>
          <Button variant="ghost" onClick={handleRestart} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Retake Quiz
          </Button>
        </div>
      </Card>
    );
  }

  const current = QUESTIONS[step];

  return (
    <Card className="mx-auto max-w-xl p-8">
      <div className="flex items-center justify-between text-xs font-medium text-muted">
        <span>
          Question {step + 1} of {QUESTIONS.length}
        </span>
        <div className="flex gap-1.5">
          {QUESTIONS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-6 rounded-full ${i <= step ? "bg-brand" : "bg-border"}`}
            />
          ))}
        </div>
      </div>

      <h3 className="mt-5 text-xl font-bold text-ink">{current.question}</h3>

      <div className="mt-6 space-y-3">
        {current.options.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => handleAnswer(option.tier)}
            className="w-full rounded-xl border border-border p-4 text-left text-sm text-ink transition-colors hover:border-brand hover:bg-brand-50"
          >
            {option.label}
          </button>
        ))}
      </div>

      {step > 0 && (
        <button
          type="button"
          onClick={handleBack}
          className="mt-6 text-sm font-medium text-muted hover:text-brand"
        >
          ← Back
        </button>
      )}
    </Card>
  );
}
