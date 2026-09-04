export type AiCrawlerStatus = { name: string; declared: boolean };

export type RobotsScanResult = {
  found: boolean;
  userAgentCount: number;
  disallowCount: number;
  allowCount: number;
  sitemapUrls: string[];
  aiCrawlers: AiCrawlerStatus[];
};

export type SitemapScanResult = {
  found: boolean;
  url: string;
  isIndex: boolean;
  urlCount: number;
};

const AI_CRAWLER_NAMES = [
  "GPTBot",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
  "anthropic-ai",
  "CCBot",
  "Applebot-Extended",
];

export function parseRobotsTxt(text: string): RobotsScanResult {
  const lines = text.split(/\r?\n/);
  let userAgentCount = 0;
  let disallowCount = 0;
  let allowCount = 0;
  const sitemapUrls: string[] = [];
  const declaredAgents = new Set<string>();

  for (const rawLine of lines) {
    const line = rawLine.split("#")[0].trim();
    if (!line) continue;

    const [rawKey, ...rest] = line.split(":");
    const key = rawKey.trim().toLowerCase();
    const value = rest.join(":").trim();

    if (key === "user-agent") {
      userAgentCount++;
      declaredAgents.add(value.toLowerCase());
    } else if (key === "disallow" && value) {
      disallowCount++;
    } else if (key === "allow" && value) {
      allowCount++;
    } else if (key === "sitemap" && value) {
      sitemapUrls.push(value);
    }
  }

  const aiCrawlers: AiCrawlerStatus[] = AI_CRAWLER_NAMES.map((name) => ({
    name,
    declared: declaredAgents.has(name.toLowerCase()),
  }));

  return {
    found: true,
    userAgentCount,
    disallowCount,
    allowCount,
    sitemapUrls,
    aiCrawlers,
  };
}

export function parseSitemapXml(xml: string): { isIndex: boolean; urlCount: number } {
  const isIndex = /<sitemapindex[\s>]/i.test(xml);
  const tag = isIndex ? "sitemap" : "url";
  const matches = xml.match(new RegExp(`<${tag}[\\s>]`, "gi"));
  return { isIndex, urlCount: matches?.length ?? 0 };
}
