import matter from "gray-matter";
import { slugify, SLUG_PATTERN } from "@/lib/slug";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const IMAGE_PATTERN = /^\/images\/blog\/[a-z0-9-]+\.(jpg|jpeg|png|webp|gif)$/i;

export type ParsedPost = {
  title: string;
  slug: string;
  fileContent: string;
};

export type ParseResult =
  | { ok: true; data: ParsedPost }
  | { ok: false; error: string; status: number };

// Shared by the create and update routes. When `lockSlug` is given (editing
// an existing post), the slug is never re-derived from the title — it's
// fixed to whatever file is actually being edited.
export function parsePostPayload(body: Record<string, unknown>, lockSlug?: string): ParseResult {
  const { title, excerpt, date, author, content, tags: rawTags, image: rawImage, slug: rawSlug } = body;

  if (typeof title !== "string" || !title.trim()) {
    return { ok: false, error: "Title is required", status: 400 };
  }
  if (typeof excerpt !== "string" || !excerpt.trim()) {
    return { ok: false, error: "Excerpt is required", status: 400 };
  }
  if (typeof content !== "string" || !content.trim()) {
    return { ok: false, error: "Content is required", status: 400 };
  }
  if (typeof date !== "string" || !DATE_PATTERN.test(date)) {
    return { ok: false, error: "Date must be in YYYY-MM-DD format", status: 400 };
  }

  const slug = lockSlug ?? slugify(typeof rawSlug === "string" && rawSlug.trim() ? rawSlug : title);
  if (!slug || !SLUG_PATTERN.test(slug)) {
    return {
      ok: false,
      error: "Could not build a valid URL slug — try a different title or slug",
      status: 400,
    };
  }

  const tags =
    typeof rawTags === "string"
      ? rawTags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

  let image: string | undefined;
  if (typeof rawImage === "string" && rawImage.trim()) {
    if (!IMAGE_PATTERN.test(rawImage.trim())) {
      return { ok: false, error: "Invalid image path", status: 400 };
    }
    image = rawImage.trim();
  }

  const fileContent = matter.stringify(`${content.trim()}\n`, {
    title: title.trim(),
    excerpt: excerpt.trim(),
    date,
    author: typeof author === "string" && author.trim() ? author.trim() : "Omo Tola",
    ...(tags.length > 0 ? { tags } : {}),
    ...(image ? { image } : {}),
  });

  return { ok: true, data: { title: title.trim(), slug, fileContent } };
}
