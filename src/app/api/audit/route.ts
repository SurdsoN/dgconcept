import { NextResponse } from "next/server";
import {
  CURATED_AUDITS,
  normalizeUrl,
  type AuditIssue,
  type AuditResult,
} from "@/lib/audit";

export const runtime = "nodejs";
export const maxDuration = 60;

const PSI_ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

type LighthouseAudit = {
  score: number | null;
  title: string;
};

type PsiResponse = {
  lighthouseResult?: {
    finalUrl?: string;
    categories?: Record<string, { score: number | null }>;
    audits?: Record<string, LighthouseAudit>;
  };
  error?: { message?: string };
};

export async function POST(request: Request) {
  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.url || typeof body.url !== "string") {
    return NextResponse.json({ error: "A website URL is required." }, { status: 400 });
  }

  let targetUrl: string;
  try {
    targetUrl = normalizeUrl(body.url);
  } catch {
    return NextResponse.json({ error: "That doesn't look like a valid URL." }, { status: 400 });
  }

  const params = new URLSearchParams({ url: targetUrl, strategy: "mobile" });
  ["performance", "seo", "accessibility", "best-practices"].forEach((c) =>
    params.append("category", c),
  );
  if (process.env.PAGESPEED_API_KEY) {
    params.set("key", process.env.PAGESPEED_API_KEY);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 55_000);

  let psi: PsiResponse;
  try {
    const res = await fetch(`${PSI_ENDPOINT}?${params.toString()}`, {
      signal: controller.signal,
    });
    psi = await res.json();

    if (!res.ok) {
      const friendlyError =
        res.status === 429
          ? "This tool is getting a lot of use right now — please try again in a minute."
          : (psi.error?.message ??
            "Couldn't reach that site right now. Double-check the URL and try again.");

      return NextResponse.json({ error: friendlyError }, { status: 502 });
    }
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "AbortError";
    return NextResponse.json(
      {
        error: timedOut
          ? "The audit took too long to run. Please try again."
          : "Something went wrong running the audit. Please try again.",
      },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }

  const lighthouse = psi.lighthouseResult;
  if (!lighthouse) {
    return NextResponse.json(
      { error: "No audit data came back for that URL. Please try again." },
      { status: 502 },
    );
  }

  const categories = lighthouse.categories ?? {};
  const audits = lighthouse.audits ?? {};

  const issues: AuditIssue[] = CURATED_AUDITS.reduce<AuditIssue[]>((acc, { id, category }) => {
    const audit = audits[id];
    if (audit && typeof audit.score === "number" && audit.score < 0.9) {
      acc.push({ id, category, title: audit.title, score: audit.score });
    }
    return acc;
  }, []).sort((a, b) => a.score - b.score);

  const result: AuditResult = {
    requestedUrl: targetUrl,
    finalUrl: lighthouse.finalUrl ?? targetUrl,
    scores: {
      performance: categories.performance?.score ?? null,
      seo: categories.seo?.score ?? null,
      accessibility: categories.accessibility?.score ?? null,
      bestPractices: categories["best-practices"]?.score ?? null,
    },
    issues: issues.slice(0, 10),
  };

  return NextResponse.json(result);
}
