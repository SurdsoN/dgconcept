import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import matter from "gray-matter";
import { ADMIN_COOKIE_NAME, isSessionTokenValid } from "@/lib/admin-auth";
import { deleteFileOnGitHub, getFileFromGitHub, upsertFileOnGitHub } from "@/lib/github-publish";
import { parsePostPayload } from "@/lib/post-payload";
import { SLUG_PATTERN } from "@/lib/slug";

export const runtime = "nodejs";

async function isAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  return isSessionTokenValid(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

// Reads straight from GitHub (not the last-deployed filesystem) so the edit
// form always starts from the true latest content, even if a previous edit
// hasn't finished deploying yet.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  if (!SLUG_PATTERN.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  try {
    const file = await getFileFromGitHub(`src/content/blog/${slug}.mdx`);
    if (!file) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    const { data, content } = matter(file.content);
    return NextResponse.json({
      title: typeof data.title === "string" ? data.title : "",
      excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
      date: typeof data.date === "string" ? data.date : "",
      author: typeof data.author === "string" ? data.author : "Omo Tola",
      tags: Array.isArray(data.tags)
        ? data.tags.filter((tag): tag is string => typeof tag === "string")
        : [],
      image: typeof data.image === "string" ? data.image : null,
      content: content.trim(),
    });
  } catch (error) {
    console.error("Failed to load blog post for editing", error);
    return NextResponse.json({ error: "Could not load that post." }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  if (!SLUG_PATTERN.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = parsePostPayload((body ?? {}) as Record<string, unknown>, slug);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }
  const { title, fileContent } = parsed.data;
  const path = `src/content/blog/${slug}.mdx`;

  try {
    const existing = await getFileFromGitHub(path);
    if (!existing) {
      return NextResponse.json(
        { error: "Post not found — it may have been removed" },
        { status: 404 },
      );
    }

    await upsertFileOnGitHub(
      path,
      Buffer.from(fileContent, "utf-8").toString("base64"),
      `Update blog post: ${title}`,
      existing.sha,
    );

    return NextResponse.json({ slug });
  } catch (error) {
    console.error("Failed to update blog post", error);
    return NextResponse.json(
      { error: "Something went wrong updating the post. Check server logs for details." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  if (!SLUG_PATTERN.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const path = `src/content/blog/${slug}.mdx`;

  try {
    const existing = await getFileFromGitHub(path);
    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await deleteFileOnGitHub(path, existing.sha, `Delete blog post: ${slug}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete blog post", error);
    return NextResponse.json(
      { error: "Something went wrong deleting the post. Check server logs for details." },
      { status: 500 },
    );
  }
}
