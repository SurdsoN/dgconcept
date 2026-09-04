import type { OnPageSeoResult } from "./onpage-seo";

export type AuditCategory = "performance" | "seo" | "accessibility" | "best-practices";

export type AuditScores = {
  performance: number | null;
  seo: number | null;
  accessibility: number | null;
  bestPractices: number | null;
};

export type AuditIssue = {
  id: string;
  title: string;
  category: AuditCategory;
  score: number;
};

export type AuditResult = {
  requestedUrl: string;
  finalUrl: string;
  scores: AuditScores;
  issues: AuditIssue[];
  onPage: OnPageSeoResult | null;
};

export const CATEGORY_LABELS: Record<AuditCategory, string> = {
  performance: "Speed",
  seo: "SEO",
  accessibility: "Accessibility & Mobile UX",
  "best-practices": "Best Practices",
};

// A curated set of Lighthouse audits, picked for being meaningful to a
// non-technical business owner rather than exhaustive. Any ID not present
// in a given PageSpeed Insights response is silently skipped, so this list
// can safely include audits that don't apply to every page.
export const CURATED_AUDITS: { id: string; category: AuditCategory }[] = [
  { id: "largest-contentful-paint", category: "performance" },
  { id: "total-blocking-time", category: "performance" },
  { id: "cumulative-layout-shift", category: "performance" },
  { id: "render-blocking-resources", category: "performance" },
  { id: "unused-css-rules", category: "performance" },
  { id: "unused-javascript", category: "performance" },
  { id: "modern-image-formats", category: "performance" },
  { id: "uses-optimized-images", category: "performance" },
  { id: "uses-responsive-images", category: "performance" },
  { id: "uses-text-compression", category: "performance" },
  { id: "unminified-css", category: "performance" },
  { id: "unminified-javascript", category: "performance" },
  { id: "document-title", category: "seo" },
  { id: "meta-description", category: "seo" },
  { id: "link-text", category: "seo" },
  { id: "is-crawlable", category: "seo" },
  { id: "crawlable-anchors", category: "seo" },
  { id: "viewport", category: "accessibility" },
  { id: "image-alt", category: "accessibility" },
  { id: "color-contrast", category: "accessibility" },
  { id: "tap-targets", category: "accessibility" },
  { id: "button-name", category: "accessibility" },
  { id: "link-name", category: "accessibility" },
  { id: "is-on-https", category: "best-practices" },
  { id: "doctype", category: "best-practices" },
  { id: "charset", category: "best-practices" },
];

export function scoreColor(score: number | null): string {
  if (score === null) return "text-muted";
  if (score >= 0.9) return "text-emerald-600";
  if (score >= 0.5) return "text-accent";
  return "text-brand";
}

export function scorePercent(score: number | null): string {
  if (score === null) return "—";
  return String(Math.round(score * 100));
}

export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return new URL(withProtocol).toString();
}
