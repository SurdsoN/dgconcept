import * as cheerio from "cheerio";

export type CheckStatus = "good" | "warning" | "bad";

export type OnPageCheck = {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
};

export type OnPageSeoResult = {
  checks: OnPageCheck[];
};

function collapseWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function analyzeOnPageSeo(html: string): OnPageSeoResult {
  const $ = cheerio.load(html);
  const checks: OnPageCheck[] = [];

  // Title tag
  const title = collapseWhitespace($("title").first().text());
  if (!title) {
    checks.push({
      id: "title",
      label: "Title Tag",
      status: "bad",
      detail: "Missing — every page needs a unique <title>.",
    });
  } else if (title.length < 30 || title.length > 60) {
    checks.push({
      id: "title",
      label: "Title Tag",
      status: "warning",
      detail: `"${title}" — ${title.length} characters (ideal range is 30-60).`,
    });
  } else {
    checks.push({
      id: "title",
      label: "Title Tag",
      status: "good",
      detail: `"${title}" — ${title.length} characters.`,
    });
  }

  // Meta description
  const metaDescription = collapseWhitespace(
    $('meta[name="description"]').attr("content") ?? "",
  );
  if (!metaDescription) {
    checks.push({
      id: "meta-description",
      label: "Meta Description",
      status: "bad",
      detail: "Missing — this is often what shows up in search results.",
    });
  } else if (metaDescription.length < 70 || metaDescription.length > 160) {
    checks.push({
      id: "meta-description",
      label: "Meta Description",
      status: "warning",
      detail: `${metaDescription.length} characters (ideal range is 70-160).`,
    });
  } else {
    checks.push({
      id: "meta-description",
      label: "Meta Description",
      status: "good",
      detail: `${metaDescription.length} characters — good length.`,
    });
  }

  // H1
  const h1s = $("h1");
  if (h1s.length === 0) {
    checks.push({
      id: "h1",
      label: "H1 Heading",
      status: "bad",
      detail: "No H1 found — every page should have exactly one.",
    });
  } else if (h1s.length > 1) {
    checks.push({
      id: "h1",
      label: "H1 Heading",
      status: "warning",
      detail: `${h1s.length} H1 tags found — best practice is exactly one per page.`,
    });
  } else {
    const h1Text = collapseWhitespace(h1s.first().text());
    checks.push({
      id: "h1",
      label: "H1 Heading",
      status: "good",
      detail: h1Text ? `"${h1Text}"` : "One H1 found.",
    });
  }

  // Heading structure (H2s)
  const h2Count = $("h2").length;
  checks.push({
    id: "h2",
    label: "Subheadings (H2)",
    status: h2Count === 0 ? "warning" : "good",
    detail:
      h2Count === 0
        ? "No H2 subheadings found — they help organize content for readers and search engines."
        : `${h2Count} H2 subheading${h2Count === 1 ? "" : "s"} found.`,
  });

  // Image alt text
  const images = $("img");
  const missingAlt = images.filter((_, el) => !$(el).attr("alt")?.trim()).length;
  if (images.length === 0) {
    checks.push({
      id: "image-alt",
      label: "Image Alt Text",
      status: "good",
      detail: "No images found on this page.",
    });
  } else if (missingAlt === 0) {
    checks.push({
      id: "image-alt",
      label: "Image Alt Text",
      status: "good",
      detail: `All ${images.length} images have alt text.`,
    });
  } else {
    checks.push({
      id: "image-alt",
      label: "Image Alt Text",
      status: missingAlt === images.length ? "bad" : "warning",
      detail: `${missingAlt} of ${images.length} images are missing alt text.`,
    });
  }

  // Canonical tag
  const canonical = $('link[rel="canonical"]').attr("href");
  checks.push({
    id: "canonical",
    label: "Canonical Tag",
    status: canonical ? "good" : "warning",
    detail: canonical ? `Points to ${canonical}` : "No canonical tag found.",
  });

  // Open Graph tags
  const ogTitle = $('meta[property="og:title"]').attr("content");
  const ogDescription = $('meta[property="og:description"]').attr("content");
  const ogImage = $('meta[property="og:image"]').attr("content");
  const ogCount = [ogTitle, ogDescription, ogImage].filter(Boolean).length;
  checks.push({
    id: "open-graph",
    label: "Social Sharing Tags (Open Graph)",
    status: ogCount === 3 ? "good" : "warning",
    detail:
      ogCount === 3
        ? "Title, description, and image tags all present."
        : `${ogCount} of 3 Open Graph tags present — affects how links look when shared on social media.`,
  });

  // Meta robots (noindex check)
  const robotsContent = ($('meta[name="robots"]').attr("content") ?? "").toLowerCase();
  if (robotsContent.includes("noindex")) {
    checks.push({
      id: "robots",
      label: "Search Engine Indexing",
      status: "bad",
      detail: "This page is set to \"noindex\" — it's telling Google not to show it in search results.",
    });
  } else {
    checks.push({
      id: "robots",
      label: "Search Engine Indexing",
      status: "good",
      detail: "Page is indexable by search engines.",
    });
  }

  // Word count (rough estimate from visible body text)
  $("script, style, noscript").remove();
  const bodyText = collapseWhitespace($("body").text());
  const wordCount = bodyText ? bodyText.split(" ").length : 0;
  checks.push({
    id: "word-count",
    label: "Content Length",
    status: wordCount < 300 ? "warning" : "good",
    detail:
      wordCount < 300
        ? `~${wordCount} words — thin content can limit ranking potential.`
        : `~${wordCount} words on the page.`,
  });

  return { checks };
}
