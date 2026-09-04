"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Loader2,
  Search,
  AlertTriangle,
  PartyPopper,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  Gauge,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendlyButton } from "@/components/integrations/calendly-button";
import {
  CATEGORY_LABELS,
  scoreColor,
  scorePercent,
  type AuditCategory,
  type FastAuditResult,
  type SpeedAuditResult,
} from "@/lib/audit";
import type { CheckStatus } from "@/lib/onpage-seo";

type FastStatus = "idle" | "loading" | "error" | "success";
type SpeedStatus = "idle" | "loading" | "error" | "success";

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

const STATUS_ICON: Record<CheckStatus, typeof CheckCircle2> = {
  good: CheckCircle2,
  warning: AlertTriangle,
  bad: XCircle,
};

const STATUS_COLOR: Record<CheckStatus, string> = {
  good: "text-emerald-600",
  warning: "text-accent",
  bad: "text-brand",
};

type ChecklistItem = { id: string; label: string; status: CheckStatus; detail: string };

function ChecklistSection({
  title,
  items,
  emptyMessage,
}: {
  title: string;
  items: ChecklistItem[] | null;
  emptyMessage: string;
}) {
  return (
    <div className="mt-6 rounded-xl border border-border p-4">
      <p className="text-sm font-semibold text-ink">{title}</p>
      {items ? (
        <ul className="mt-2 space-y-2">
          {items.map((item) => {
            const Icon = STATUS_ICON[item.status];
            return (
              <li key={item.id} className="flex items-start gap-2 text-sm">
                <Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${STATUS_COLOR[item.status]}`} />
                <span>
                  <span className="font-medium text-ink">{item.label}:</span>{" "}
                  <span className="text-muted">{item.detail}</span>
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted">{emptyMessage}</p>
      )}
    </div>
  );
}

export function WebsiteAuditTool() {
  const [url, setUrl] = useState("");

  const [fastStatus, setFastStatus] = useState<FastStatus>("idle");
  const [fastError, setFastError] = useState("");
  const [fastResult, setFastResult] = useState<FastAuditResult | null>(null);

  const [speedStatus, setSpeedStatus] = useState<SpeedStatus>("idle");
  const [speedError, setSpeedError] = useState("");
  const [speedResult, setSpeedResult] = useState<SpeedAuditResult | null>(null);

  const issuesByCategory = useMemo(() => {
    if (!speedResult) return {};
    return speedResult.issues.reduce<Record<string, typeof speedResult.issues>>(
      (acc, issue) => {
        (acc[issue.category] ??= []).push(issue);
        return acc;
      },
      {},
    );
  }, [speedResult]);

  const crawlItems = useMemo<ChecklistItem[] | null>(() => {
    const scan = fastResult?.siteScan;
    if (!scan) return null;
    const items: ChecklistItem[] = [];

    if (scan.robots) {
      items.push({
        id: "robots",
        label: "robots.txt",
        status: "good",
        detail: `Found — ${scan.robots.disallowCount} disallow rule${scan.robots.disallowCount === 1 ? "" : "s"}, ${scan.robots.allowCount} allow rule${scan.robots.allowCount === 1 ? "" : "s"}.`,
      });
      const declaredAi = scan.robots.aiCrawlers.filter((c) => c.declared).length;
      items.push({
        id: "ai-crawlers",
        label: "AI Crawler Access",
        status: declaredAi > 0 ? "good" : "warning",
        detail:
          declaredAi > 0
            ? `${declaredAi} of ${scan.robots.aiCrawlers.length} AI crawlers (GPTBot, ClaudeBot, etc.) explicitly addressed.`
            : "No AI crawlers (GPTBot, ClaudeBot, Google-Extended, etc.) explicitly addressed in robots.txt.",
      });
    } else {
      items.push({
        id: "robots",
        label: "robots.txt",
        status: "warning",
        detail: "Not found or unreachable.",
      });
    }

    items.push({
      id: "sitemap",
      label: "XML Sitemap",
      status: scan.sitemap ? "good" : "warning",
      detail: scan.sitemap
        ? scan.sitemap.isIndex
          ? `Sitemap index found, referencing multiple sitemaps.`
          : `Found — ${scan.sitemap.urlCount} URL${scan.sitemap.urlCount === 1 ? "" : "s"} listed.`
        : "No sitemap referenced in robots.txt.",
    });

    return items;
  }, [fastResult]);

  const headerItems = useMemo<ChecklistItem[] | null>(() => {
    const header = fastResult?.siteScan?.header;
    if (!header) return null;
    return [
      {
        id: "logo",
        label: "Logo",
        status: header.logoDetected ? "good" : "warning",
        detail: header.logoDetected ? "Detected in the header." : "Not confidently detected.",
      },
      {
        id: "nav",
        label: "Navigation Links",
        status: header.navLinkCount > 0 ? "good" : "bad",
        detail:
          header.navLinkCount > 0
            ? `${header.navLinkCount} nav link${header.navLinkCount === 1 ? "" : "s"} found.`
            : "No navigation links detected — visitors may struggle to browse.",
      },
      {
        id: "search",
        label: "Search",
        status: header.searchDetected ? "good" : "warning",
        detail: header.searchDetected ? "Detected." : "Not confidently detected.",
      },
      {
        id: "cart",
        label: "Cart",
        status: header.cartDetected ? "good" : "bad",
        detail: header.cartDetected ? "Detected." : "Not confidently detected — verify it's visible on every page.",
      },
      {
        id: "account",
        label: "Account / Login",
        status: header.accountDetected ? "good" : "warning",
        detail: header.accountDetected ? "Detected." : "Not confidently detected.",
      },
    ];
  }, [fastResult]);

  const policyItems = useMemo<ChecklistItem[] | null>(() => {
    const policies = fastResult?.siteScan?.policies;
    if (!policies || policies.length === 0) return null;
    return policies.map((p) => ({
      id: p.label,
      label: p.label,
      status: !p.found ? "bad" : p.thin ? "warning" : "good",
      detail: !p.found ? "Not found." : p.thin ? "Found, but content looks very thin." : "Found.",
    }));
  }, [fastResult]);

  const appItems = useMemo<ChecklistItem[] | null>(() => {
    const shopify = fastResult?.siteScan?.shopify;
    if (!shopify) return null;
    const items: ChecklistItem[] = [
      {
        id: "platform",
        label: "Platform",
        status: "good",
        detail: shopify.isShopify
          ? shopify.myshopifyDomain
            ? `Shopify (${shopify.myshopifyDomain})`
            : "Shopify confirmed."
          : "Not confirmed as Shopify from public signals.",
      },
    ];
    if (shopify.apps.length > 0) {
      items.push({
        id: "apps",
        label: "Detected Apps",
        status: "good",
        detail: shopify.apps.map((a) => `${a.name} (${a.category})`).join(", "),
      });
    } else {
      items.push({
        id: "apps",
        label: "Detected Apps",
        status: "warning",
        detail: "No common third-party apps detected from public signals.",
      });
    }
    return items;
  }, [fastResult]);

  async function runFastAudit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!url.trim()) return;

    setFastStatus("loading");
    setFastError("");
    setFastResult(null);
    setSpeedStatus("idle");
    setSpeedError("");
    setSpeedResult(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (!res.ok) {
        setFastError(data.error ?? "Something went wrong. Please try again.");
        setFastStatus("error");
        return;
      }

      setFastResult(data);
      setFastStatus("success");
    } catch {
      setFastError("Something went wrong. Please try again.");
      setFastStatus("error");
    }
  }

  async function runSpeedAudit() {
    if (!fastResult) return;

    setSpeedStatus("loading");
    setSpeedError("");

    try {
      const res = await fetch("/api/audit/speed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: fastResult.finalUrl }),
      });
      const data = await res.json();

      if (!res.ok) {
        setSpeedError(data.error ?? "Something went wrong. Please try again.");
        setSpeedStatus("error");
        return;
      }

      setSpeedResult(data);
      setSpeedStatus("success");
    } catch {
      setSpeedError("Something went wrong. Please try again.");
      setSpeedStatus("error");
    }
  }

  return (
    <Card className="mx-auto max-w-3xl p-6 sm:p-10">
      <form onSubmit={runFastAudit} className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="text"
          placeholder="yourstore.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
          required
        />
        <Button type="submit" disabled={fastStatus === "loading"}>
          {fastStatus === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          {fastStatus === "loading" ? "Scanning..." : "Run Free Audit"}
        </Button>
      </form>

      {fastStatus === "loading" && (
        <p className="mt-4 text-center text-sm text-muted">
          Scanning your site — this only takes a few seconds.
        </p>
      )}

      {fastStatus === "error" && (
        <div className="mt-6 rounded-lg bg-brand-50 p-4 text-sm text-brand">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{fastError}</p>
          </div>
          <Link
            href={`/contact?url=${encodeURIComponent(url)}`}
            className="mt-2 inline-block font-medium underline underline-offset-2"
          >
            Contact me for a manual audit instead →
          </Link>
        </div>
      )}

      {fastStatus === "success" && fastResult && (
        <div className="mt-8">
          <p className="text-center text-xs text-muted">
            Results for <span className="font-medium text-ink">{fastResult.finalUrl}</span>
          </p>

          {/* Speed / Lighthouse section — opt-in, since it's the slow part */}
          <div className="mt-6 rounded-xl border border-border p-4">
            {speedStatus === "idle" && (
              <div className="flex flex-col items-center gap-3 py-2 text-center">
                <Gauge className="h-6 w-6 text-brand" />
                <div>
                  <p className="text-sm font-semibold text-ink">
                    Want real Speed & Lighthouse scores?
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Runs a full Google Lighthouse audit — takes up to 90 seconds.
                  </p>
                </div>
                <Button onClick={runSpeedAudit} variant="outline">
                  Run Full Speed Audit
                </Button>
              </div>
            )}

            {speedStatus === "loading" && (
              <div className="flex flex-col items-center gap-2 py-4 text-center">
                <Loader2 className="h-5 w-5 animate-spin text-brand" />
                <p className="text-sm text-muted">
                  Running a real Lighthouse audit — this can take up to 90 seconds.
                </p>
              </div>
            )}

            {speedStatus === "error" && (
              <div className="text-center">
                <p className="flex items-center justify-center gap-2 text-sm text-brand">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {speedError}
                </p>
                <Button onClick={runSpeedAudit} variant="outline" className="mt-3">
                  Try Again
                </Button>
              </div>
            )}

            {speedStatus === "success" && speedResult && (
              <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <ScoreCard label="Speed" score={speedResult.scores.performance} />
                  <ScoreCard label="SEO" score={speedResult.scores.seo} />
                  <ScoreCard label="Accessibility" score={speedResult.scores.accessibility} />
                  <ScoreCard label="Best Practices" score={speedResult.scores.bestPractices} />
                </div>

                {speedResult.issues.length === 0 ? (
                  <div className="mt-4 flex flex-col items-center gap-2 rounded-xl bg-surface-muted p-6 text-center">
                    <PartyPopper className="h-5 w-5 text-brand" />
                    <p className="text-sm font-semibold text-ink">
                      No major speed issues found.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    {CATEGORY_ORDER.filter((c) => issuesByCategory[c]?.length).map((category) => (
                      <div key={category}>
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
              </>
            )}
          </div>

          <ChecklistSection
            title="On-Page SEO"
            items={fastResult.onPage?.checks ?? null}
            emptyMessage="Couldn't check this site's on-page SEO directly — it may be blocking automated requests."
          />

          <ChecklistSection
            title="Crawlability"
            items={crawlItems}
            emptyMessage="Couldn't check robots.txt or sitemap directly."
          />

          <ChecklistSection
            title="Header & Navigation"
            items={headerItems}
            emptyMessage="Couldn't check this site's header directly — it may be blocking automated requests."
          />

          <ChecklistSection
            title="Store Policies"
            items={policyItems}
            emptyMessage="Couldn't check policy pages directly."
          />

          <ChecklistSection
            title="Platform & Apps"
            items={appItems}
            emptyMessage="Couldn't detect platform or app signals directly."
          />

          <div className="mt-6 rounded-xl border border-border p-4">
            <p className="text-sm font-semibold text-ink">Public Contact Info Found</p>
            {fastResult.siteScan.contact.emails.length === 0 &&
            fastResult.siteScan.contact.phones.length === 0 ? (
              <p className="mt-2 text-sm text-muted">
                No public email or phone number found on the homepage or policy pages.
              </p>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {fastResult.siteScan.contact.emails.map((e) => (
                  <li key={e.address} className="flex items-center gap-2 text-sm text-muted">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-brand" />
                    {e.address} <span className="text-xs">(via {e.source})</span>
                  </li>
                ))}
                {fastResult.siteScan.contact.phones.map((p) => (
                  <li key={p.number} className="flex items-center gap-2 text-sm text-muted">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-brand" />
                    {p.number} <span className="text-xs">(via {p.source})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href={`/contact?url=${encodeURIComponent(fastResult.requestedUrl)}`}>
                Let&apos;s Fix These Issues →
              </Link>
            </Button>
            <CalendlyButton variant="outline" size="lg">
              Book a Call
            </CalendlyButton>
          </div>
        </div>
      )}
    </Card>
  );
}
