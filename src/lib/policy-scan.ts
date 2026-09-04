import * as cheerio from "cheerio";

export type PolicyPageResult = {
  label: string;
  path: string;
  found: boolean;
  thin: boolean;
};

export const POLICY_PAGES: { label: string; paths: string[] }[] = [
  { label: "Privacy Policy", paths: ["/policies/privacy-policy"] },
  { label: "Refund Policy", paths: ["/policies/refund-policy"] },
  { label: "Shipping Policy", paths: ["/policies/shipping-policy"] },
  { label: "Terms of Service", paths: ["/policies/terms-of-service"] },
  { label: "Contact Page", paths: ["/pages/contact", "/pages/contact-us", "/contact"] },
];

const THIN_CONTENT_CHAR_THRESHOLD = 400;

export function classifyPolicyContent(html: string): { thin: boolean; charCount: number } {
  const $ = cheerio.load(html);
  $("script, style, noscript, header, footer, nav").remove();
  const text = $("body").text().replace(/\s+/g, " ").trim();
  return { thin: text.length < THIN_CONTENT_CHAR_THRESHOLD, charCount: text.length };
}
