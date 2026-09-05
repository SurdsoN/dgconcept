import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, isSessionTokenValid } from "@/lib/admin-auth";
import { getFileFromGitHub, upsertFileOnGitHub } from "@/lib/github-publish";
import { parsePostPayload } from "@/lib/post-payload";

export const runtime = "nodejs";

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

  const parsed = parsePostPayload((body ?? {}) as Record<string, unknown>);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }
  const { title, slug, fileContent } = parsed.data;
  const path = `src/content/blog/${slug}.mdx`;

  try {
    const existing = await getFileFromGitHub(path);
    if (existing) {
      return NextResponse.json(
        { error: `A post with the slug "${slug}" already exists — choose a different title or slug` },
        { status: 409 },
      );
    }

    await upsertFileOnGitHub(
      path,
      Buffer.from(fileContent, "utf-8").toString("base64"),
      `Add blog post: ${title}`,
    );

    return NextResponse.json({ slug });
  } catch (error) {
    console.error("Failed to publish blog post", error);
    return NextResponse.json(
      { error: "Something went wrong publishing the post. Check server logs for details." },
      { status: 500 },
    );
  }
}
