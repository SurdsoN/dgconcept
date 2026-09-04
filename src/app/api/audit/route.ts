import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";
import { normalizeUrl, type FastAuditResult } from "@/lib/audit";
import { analyzeOnPageSeo } from "@/lib/onpage-seo";
import { runSiteScan } from "@/lib/site-scan";

export const runtime = "nodejs";
export const maxDuration = 30;

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

async function fetchHomepage(url: string): Promise<{ html: string; $: CheerioAPI } | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const res = await fetch(url, { signal: controller.signal, headers: BROWSER_HEADERS });
    if (!res.ok) {
      console.error("[audit] Homepage fetch got non-OK response", {
        url,
        status: res.status,
        statusText: res.statusText,
      });
      return null;
    }

    const html = await res.text();
    return { html, $: cheerio.load(html) };
  } catch (err) {
    console.error("[audit] Homepage fetch failed", {
      url,
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

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

  const homepage = await fetchHomepage(targetUrl);
  const onPage = homepage ? analyzeOnPageSeo(homepage.$) : null;
  const siteScan = await runSiteScan(targetUrl, homepage);

  const result: FastAuditResult = {
    requestedUrl: targetUrl,
    finalUrl: targetUrl,
    onPage,
    siteScan,
  };

  return NextResponse.json(result);
}
