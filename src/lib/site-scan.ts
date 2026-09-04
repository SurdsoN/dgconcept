import * as cheerio from "cheerio";
import type { CheerioAPI } from "cheerio";
import { analyzeHeader, type HeaderScanResult } from "./header-scan";
import { analyzeShopifySignals, type ShopifyScanResult } from "./shopify-scan";
import { extractContactInfo, type ContactScanResult } from "./contact-scan";
import {
  parseRobotsTxt,
  parseSitemapXml,
  type RobotsScanResult,
  type SitemapScanResult,
} from "./robots-scan";
import { POLICY_PAGES, classifyPolicyContent, type PolicyPageResult } from "./policy-scan";

export type SiteScanResult = {
  header: HeaderScanResult | null;
  shopify: ShopifyScanResult | null;
  contact: ContactScanResult;
  robots: RobotsScanResult | null;
  sitemap: SitemapScanResult | null;
  policies: PolicyPageResult[];
};

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

async function fetchText(
  url: string,
  timeoutMs: number,
): Promise<{ ok: boolean; text: string } | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: FETCH_HEADERS });
    if (!res.ok) return { ok: false, text: "" };
    return { ok: true, text: await res.text() };
  } catch (err) {
    console.error("[audit] site-scan fetch failed", {
      url,
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function scanRobotsAndSitemap(
  origin: string,
): Promise<{ robots: RobotsScanResult | null; sitemap: SitemapScanResult | null }> {
  const robotsRes = await fetchText(`${origin}/robots.txt`, 10_000);
  if (!robotsRes?.ok) return { robots: null, sitemap: null };

  const robots = parseRobotsTxt(robotsRes.text);
  const sitemapUrl = robots.sitemapUrls[0];
  if (!sitemapUrl) return { robots, sitemap: null };

  const sitemapRes = await fetchText(sitemapUrl, 10_000);
  if (!sitemapRes?.ok) return { robots, sitemap: null };

  const parsed = parseSitemapXml(sitemapRes.text);
  return {
    robots,
    sitemap: { found: true, url: sitemapUrl, isIndex: parsed.isIndex, urlCount: parsed.urlCount },
  };
}

async function scanPolicyPages(
  origin: string,
): Promise<{ policies: PolicyPageResult[]; pages: { source: string; $: CheerioAPI }[] }> {
  const pages: { source: string; $: CheerioAPI }[] = [];

  const policies = await Promise.all(
    POLICY_PAGES.map(async ({ label, paths }) => {
      for (const path of paths) {
        const res = await fetchText(`${origin}${path}`, 10_000);
        if (res?.ok) {
          const { thin } = classifyPolicyContent(res.text);
          pages.push({ source: label, $: cheerio.load(res.text) });
          return { label, path, found: true, thin };
        }
      }
      return { label, path: paths[0], found: false, thin: false };
    }),
  );

  return { policies, pages };
}

export async function runSiteScan(
  targetUrl: string,
  homepage: { html: string; $: CheerioAPI } | null,
): Promise<SiteScanResult> {
  const origin = new URL(targetUrl).origin;

  const header = homepage ? analyzeHeader(homepage.$) : null;
  const shopify = homepage ? analyzeShopifySignals(homepage.html, homepage.$) : null;

  const [{ robots, sitemap }, { policies, pages: policyPages }] = await Promise.all([
    scanRobotsAndSitemap(origin),
    scanPolicyPages(origin),
  ]);

  const contactPages = homepage
    ? [{ source: "Homepage", $: homepage.$ }, ...policyPages]
    : policyPages;
  const contact = extractContactInfo(contactPages);

  return { header, shopify, contact, robots, sitemap, policies };
}
