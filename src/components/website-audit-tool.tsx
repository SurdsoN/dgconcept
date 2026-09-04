"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { Loader2, Search, AlertTriangle, PartyPopper, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_LABELS,
  scoreColor,
  scorePercent,
  type AuditCategory,
  type AuditResult,
} from "@/lib/audit";

type Status = "idle" | "loading" | "error" | "success";

const CATEGORY_ORDER: AuditCategory[] = [
  "performance",
  "seo",
  "accessibility",
  "best-practices",
];

function ScoreCard({ label, score }: { label: string; score: number | null }) {
  return (
    <div className="rounded-xl border border-border bg-surface-muted p-4 text-center">
      <p className={`text-3xl font-bold ${scoreColor(score)}`}>{scorePercent(score)}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}

export function WebsiteAuditTool() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);

  const issuesByCategory = useMemo(() => {
    if (!result) return {};
    return result.issues.reduce<Record<string, typeof result.issues>>((acc, issue) => {
      (acc[issue.category] ??= []).push(issue);
      return acc;
    }, {});
  }, [result]);

  async function runAudit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!url.trim()) return;

    setStatus("loading");
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setResult(data);
      setStatus("success");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <Card className="mx-auto max-w-3xl p-6 sm:p-10">
      <form onSubmit={runAudit} className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="text"
          placeholder="yourstore.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
          required
        />
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          {status === "loading" ? "Running Audit..." : "Run Free Audit"}
        </Button>
      </form>

      {status === "loading" && (
        <p className="mt-4 text-center text-sm text-muted">
          Running a real Lighthouse audit on your site — this can take up to a minute.
        </p>
      )}

      {status === "error" && (
        <div className="mt-6 rounded-lg bg-brand-50 p-4 text-sm text-brand">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
          <Link
            href={`/contact?url=${encodeURIComponent(url)}`}
            className="mt-2 inline-block font-medium underline underline-offset-2"
          >
            Contact me for a manual audit instead →
          </Link>
        </div>
      )}

      {status === "success" && result && (
        <div className="mt-8">
          <p className="text-center text-xs text-muted">
            Results for <span className="font-medium text-ink">{result.finalUrl}</span>
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <ScoreCard label="Speed" score={result.scores.performance} />
            <ScoreCard label="SEO" score={result.scores.seo} />
            <ScoreCard label="Accessibility" score={result.scores.accessibility} />
            <ScoreCard label="Best Practices" score={result.scores.bestPractices} />
          </div>

          {result.issues.length === 0 ? (
            <div className="mt-6 flex flex-col items-center gap-2 rounded-xl border border-border bg-surface-muted p-8 text-center">
              <PartyPopper className="h-6 w-6 text-brand" />
              <p className="font-semibold text-ink">
                Nice — no major issues found in the areas we checked.
              </p>
              <p className="text-sm text-muted">
                Want a second opinion or help squeezing out more performance?
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {CATEGORY_ORDER.filter((c) => issuesByCategory[c]?.length).map((category) => (
                <div key={category} className="rounded-xl border border-border p-4">
                  <p className="text-sm font-semibold text-ink">
                    {CATEGORY_LABELS[category]}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {issuesByCategory[category]!.map((issue) => (
                      <li
                        key={issue.id}
                        className="flex items-start gap-2 text-sm text-muted"
                      >
                        <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                        {issue.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Button asChild size="lg">
              <Link href={`/contact?url=${encodeURIComponent(result.requestedUrl)}`}>
                Let&apos;s Fix These Issues →
              </Link>
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
