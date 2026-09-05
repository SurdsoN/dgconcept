import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, isSessionTokenValid } from "@/lib/admin-auth";
import { deleteFileOnGitHub, getFileFromGitHub, upsertFileOnGitHub } from "@/lib/github-publish";

export const runtime = "nodejs";

const SLUG_PATTERN = /^[0-9]+-[a-z0-9]+$/;

async function requireAuth() {
  const cookieStore = await cookies();
  return isSessionTokenValid(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

// Approve a pending review — flips its status to "approved" so it shows on
// the public /reviews page.
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  if (!SLUG_PATTERN.test(slug)) {
    return NextResponse.json({ error: "Invalid review" }, { status: 400 });
  }

  const path = `src/content/reviews/${slug}.json`;

  try {
    const existing = await getFileFromGitHub(path);
    if (!existing) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const data = JSON.parse(existing.content) as Record<string, unknown>;
    data.status = "approved";

    await upsertFileOnGitHub(
      path,
      Buffer.from(JSON.stringify(data, null, 2), "utf-8").toString("base64"),
      `Approve review: ${slug}`,
      existing.sha,
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to approve review", error);
    return NextResponse.json(
      { error: "Something went wrong approving the review. Check server logs for details." },
      { status: 500 },
    );
  }
}

// Reject a pending review — removes it entirely rather than keeping a
// rejected record around.
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  if (!SLUG_PATTERN.test(slug)) {
    return NextResponse.json({ error: "Invalid review" }, { status: 400 });
  }

  const path = `src/content/reviews/${slug}.json`;

  try {
    const existing = await getFileFromGitHub(path);
    if (!existing) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    await deleteFileOnGitHub(path, existing.sha, `Reject review: ${slug}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to reject review", error);
    return NextResponse.json(
      { error: "Something went wrong rejecting the review. Check server logs for details." },
      { status: 500 },
    );
  }
}
