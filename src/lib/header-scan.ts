import type { CheerioAPI } from "cheerio";

export type HeaderScanResult = {
  logoDetected: boolean;
  navLinkCount: number;
  searchDetected: boolean;
  cartDetected: boolean;
  accountDetected: boolean;
};

export function analyzeHeader($: CheerioAPI): HeaderScanResult {
  const headerScope = $("header, [class*='header' i], [id*='header' i]").first();
  const scope = headerScope.length ? headerScope : $("body");

  const logoDetected =
    scope.find(
      "img[class*='logo' i], img[id*='logo' i], img[alt*='logo' i], img[src*='logo' i], svg[class*='logo' i], a[class*='logo' i]",
    ).length > 0;

  // Prefer links inside a semantic <nav>. If a site doesn't use one, fall
  // back to header links that don't look like utility icons (cart/account/
  // search), so those aren't double-counted as "navigation".
  const utilityPattern = /cart|account|login|search|wishlist/i;
  const navScope = $("nav").length ? $("nav") : scope;
  const navLinks = navScope
    .find("a[href]")
    .toArray()
    .filter((el) => {
      if ($("nav").length) return true;
      const href = $(el).attr("href") ?? "";
      const cls = $(el).attr("class") ?? "";
      return !utilityPattern.test(href) && !utilityPattern.test(cls);
    });
  const uniqueHrefs = new Set(
    navLinks
      .map((el) => $(el).attr("href"))
      .filter((href): href is string => Boolean(href && href !== "#")),
  );

  const searchDetected =
    $("input[type='search'], form[role='search'], form[action*='search']").length > 0 ||
    scope.find("[class*='search' i], [aria-label*='search' i], a[href*='/search']").length > 0;

  const cartDetected =
    scope.find("a[href*='/cart'], [class*='cart' i], [aria-label*='cart' i]").length > 0;

  const accountDetected =
    scope.find(
      "a[href*='/account'], a[href*='/login'], [class*='account' i], [aria-label*='account' i]",
    ).length > 0;

  return {
    logoDetected,
    navLinkCount: uniqueHrefs.size,
    searchDetected,
    cartDetected,
    accountDetected,
  };
}
