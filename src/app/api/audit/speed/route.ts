import { NextResponse } from "next/server";
import {
  CURATED_AUDITS,
  normalizeUrl,
  type AuditIssue,
  type SpeedAuditResult,
} from "@/lib/audit";

export const runtime = "nodejs";
export const maxDuration = 90;

const PSI_ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

type LighthouseAudit = {
  score: number | null;
  title: string;
};

type PsiResponse = {
  lighthouseResult?: {
    categories?: Record<string, { score: number | null }>;
    audits?: Record<string, LighthouseAudit>;
  };
  error?: {
    message?: string;
    errors?: { reason?: string; message?: string }[];
  };
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
  const timeout = setTimeout(() => controller.abort(), 85_000);

  let psi: PsiResponse;
  try {
    const res = await fetch(`${PSI_ENDPOINT}?${params.toString()}`, {
      signal: controller.signal,
    });
    psi = await res.json();

    if (!res.ok) {
      const reason = psi.error?.errors?.[0]?.reason;

      console.error("[audit/speed] PageSpeed Insights error", {
        url: targetUrl,
        status: res.status,
        reason,
        message: psi.error?.message,
      });

      let friendlyError: string;
      if (res.status === 429) {
        friendlyError = "This tool is getting a lot of use right now — please try again in a minute.";
      } else if (reason === "lighthouseError") {
        friendlyError =
          "Google's audit tool couldn't load this site — it may be blocking automated visits (common with some Shopify security apps or firewalls).";
      } else {
        friendlyError =
          psi.error?.message ??
          "Couldn't reach that site right now. Double-check the URL and try again.";
      }

      return NextResponse.json({ error: friendlyError }, { status: 502 });
    }
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "AbortError";

    console.error("[audit/speed] Request failed", {
      url: targetUrl,
      timedOut,
      error: err instanceof Error ? err.message : String(err),
    });

    return NextResponse.json(
      {
        error: timedOut
          ? "The speed audit took too long to run. Please try again."
          : "Something went wrong running the speed audit. Please try again.",
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

  const result: SpeedAuditResult = {
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
