import type { CheerioAPI } from "cheerio";

export type DetectedApp = { name: string; category: string };

export type ShopifyScanResult = {
  isShopify: boolean;
  myshopifyDomain: string | null;
  apps: DetectedApp[];
};

const APP_SIGNATURES: { pattern: RegExp; name: string; category: string }[] = [
  { pattern: /klaviyo\.com/i, name: "Klaviyo", category: "Email & SMS" },
  { pattern: /judge\.me/i, name: "Judge.me", category: "Reviews" },
  { pattern: /loox\.(io|app)/i, name: "Loox", category: "Reviews" },
  { pattern: /yotpo\.com/i, name: "Yotpo", category: "Reviews" },
  { pattern: /privy\.com/i, name: "Privy", category: "Email & SMS" },
  { pattern: /rechargepayments\.com|recharge\.com/i, name: "ReCharge", category: "Subscriptions" },
  { pattern: /gorgias\.(chat|com)/i, name: "Gorgias", category: "Live Chat / Support" },
  { pattern: /tawk\.to/i, name: "Tawk.to", category: "Live Chat / Support" },
  { pattern: /klarna\.com/i, name: "Klarna", category: "Payments" },
  { pattern: /afterpay\.com/i, name: "Afterpay", category: "Payments" },
  { pattern: /pagefly\.io/i, name: "PageFly", category: "Page Builder" },
  { pattern: /getshogun\.com/i, name: "Shogun", category: "Page Builder" },
  { pattern: /boldapps\.net/i, name: "Bold", category: "Upsell / Subscriptions" },
  { pattern: /smile\.io/i, name: "Smile.io", category: "Loyalty" },
  { pattern: /attentivemobile\.com/i, name: "Attentive", category: "Email & SMS" },
  { pattern: /postscript\.io/i, name: "Postscript", category: "Email & SMS" },
  { pattern: /onesignal\.com/i, name: "OneSignal", category: "Push Notifications" },
  { pattern: /hotjar\.com/i, name: "Hotjar", category: "Analytics" },
  { pattern: /googletagmanager\.com|google-analytics\.com/i, name: "Google Analytics / GTM", category: "Analytics" },
  { pattern: /connect\.facebook\.net/i, name: "Meta Pixel", category: "Advertising" },
  { pattern: /analytics\.tiktok\.com/i, name: "TikTok Pixel", category: "Advertising" },
  { pattern: /ct\.pinterest\.com/i, name: "Pinterest Tag", category: "Advertising" },
];

export function analyzeShopifySignals(html: string, $: CheerioAPI): ShopifyScanResult {
  const generator = $('meta[name="generator"]').attr("content") ?? "";
  const isShopify =
    /shopify/i.test(generator) ||
    /cdn\.shopify\.com/i.test(html) ||
    /Shopify\.shop/i.test(html);

  const domainMatch = html.match(/([a-z0-9-]+\.myshopify\.com)/i);
  const myshopifyDomain = domainMatch ? domainMatch[1].toLowerCase() : null;

  const seen = new Set<string>();
  const apps: DetectedApp[] = [];
  for (const { pattern, name, category } of APP_SIGNATURES) {
    if (pattern.test(html) && !seen.has(name)) {
      seen.add(name);
      apps.push({ name, category });
    }
  }

  return { isShopify, myshopifyDomain, apps };
}
