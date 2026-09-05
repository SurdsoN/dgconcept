import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import matter from "gray-matter";
import { ADMIN_COOKIE_NAME, isSessionTokenValid } from "@/lib/admin-auth";
import { fileExistsOnGitHub, createFileOnGitHub } from "@/lib/github-publish";
import { slugify, SLUG_PATTERN } from "@/lib/slug";

export const runtime = "nodejs";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!isSessionTokenValid(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { title, excerpt, date, author, content, slug: rawSlug } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (typeof excerpt !== "string" || !excerpt.trim()) {
    return NextResponse.json({ error: "Excerpt is required" }, { status: 400 });
  }
  if (typeof content !== "string" || !content.trim()) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }
  if (typeof date !== "string" || !DATE_PATTERN.test(date)) {
    return NextResponse.json({ error: "Date must be in YYYY-MM-DD format" }, { status: 400 });
  }

  const slug = slugify(typeof rawSlug === "string" && rawSlug.trim() ? rawSlug : title);
  if (!slug || !SLUG_PATTERN.test(slug)) {
    return NextResponse.json(
      { error: "Could not build a valid URL slug — try a different title or slug" },
      { status: 400 },
    );
  }

  const path = `src/content/blog/${slug}.mdx`;

  try {
    const exists = await fileExistsOnGitHub(path);
    if (exists) {
      return NextResponse.json(
        { error: `A post with the slug "${slug}" already exists — choose a different title or slug` },
        { status: 409 },
      );
    }

    const fileContent = matter.stringify(`${content.trim()}\n`, {
      title: title.trim(),
      excerpt: excerpt.trim(),
      date,
      author: typeof author === "string" && author.trim() ? author.trim() : "Omo Tola",
    });

    await createFileOnGitHub(path, fileContent, `Add blog post: ${title.trim()}`);

    return NextResponse.json({ slug });
  } catch (error) {
    console.error("Failed to publish blog post", error);
    return NextResponse.json(
      { error: "Something went wrong publishing the post. Check server logs for details." },
      { status: 500 },
    );
  }
}
