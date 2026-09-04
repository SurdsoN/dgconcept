import type { CheerioAPI } from "cheerio";

export type ContactScanResult = {
  emails: { address: string; source: string }[];
  phones: { number: string; source: string }[];
};

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_REGEX = /(\+?\d[\d\s().-]{7,}\d)/g;

function isLikelyPhone(candidate: string): boolean {
  const digits = candidate.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

export function extractContactInfo(
  pages: { source: string; $: CheerioAPI }[],
): ContactScanResult {
  const emails = new Map<string, string>();
  const phones = new Map<string, string>();

  for (const { source, $ } of pages) {
    const bodyText = $("body").text();

    for (const match of bodyText.matchAll(EMAIL_REGEX)) {
      const address = match[0].toLowerCase();
      if (!emails.has(address)) emails.set(address, source);
    }
    $("a[href^='mailto:']").each((_, el) => {
      const address = ($(el).attr("href") ?? "")
        .replace(/^mailto:/i, "")
        .split("?")[0]
        .trim()
        .toLowerCase();
      if (address && !emails.has(address)) emails.set(address, source);
    });

    $("a[href^='tel:']").each((_, el) => {
      const number = ($(el).attr("href") ?? "").replace(/^tel:/i, "").trim();
      if (number && isLikelyPhone(number) && !phones.has(number)) {
        phones.set(number, source);
      }
    });
    for (const match of bodyText.matchAll(PHONE_REGEX)) {
      const number = match[0].trim();
      if (isLikelyPhone(number) && !phones.has(number) && phones.size < 5) {
        phones.set(number, source);
      }
    }
  }

  return {
    emails: Array.from(emails.entries()).map(([address, source]) => ({ address, source })),
    phones: Array.from(phones.entries()).map(([number, source]) => ({ number, source })),
  };
}
