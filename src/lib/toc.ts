import { slugify } from "@/lib/slug";

export type TocItem = { id: string; text: string; depth: 2 | 3 };

// Mirrors the heading-id logic in mdx-heading-ids.ts (same slugify, same
// first-occurrence-wins dedup order) so anchor links always match the
// rendered heading ids.
export function extractToc(markdown: string): TocItem[] {
  const seen = new Map<string, number>();
  const items: TocItem[] = [];

  for (const line of markdown.split("\n")) {
    const match = /^(##|###)\s+(.+)$/.exec(line.trim());
    if (!match) continue;

    const depth = match[1].length === 2 ? 2 : 3;
    const text = match[2].trim();
    let id = slugify(text) || "section";
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count}`;

    items.push({ id, text, depth });
  }

  return items;
}
