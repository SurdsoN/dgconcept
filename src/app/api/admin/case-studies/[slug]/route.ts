import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, isSessionTokenValid } from "@/lib/admin-auth";
import { deleteFileOnGitHub, getFileFromGitHub, upsertFileOnGitHub } from "@/lib/github-publish";
import { SLUG_PATTERN } from "@/lib/slug";
import { CASE_STUDY_IMAGE_PATH_PATTERN as IMAGE_PATH_PATTERN } from "@/lib/case-study-image-path";

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
    const file = await getFileFromGitHub(`src/content/case-studies/${slug}.json`);
    if (!file) {
      return NextResponse.json({ error: "Case study not found" }, { status: 404 });
    }
    const data = JSON.parse(file.content) as Record<string, unknown>;
    return NextResponse.json({
      name: typeof data.name === "string" ? data.name : "",
      category: typeof data.category === "string" ? data.category : "",
      description: typeof data.description === "string" ? data.description : "",
      liveUrl: typeof data.liveUrl === "string" ? data.liveUrl : "",
      images: Array.isArray(data.images)
        ? data.images.filter((img): img is string => typeof img === "string")
        : [],
    });
  } catch (error) {
    console.error("Failed to load case study for editing", error);
    return NextResponse.json({ error: "Could not load that case study." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
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

  const { name, category, description, images, liveUrl } = (body ?? {}) as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (typeof category !== "string" || !category.trim()) {
    return NextResponse.json({ error: "Category is required" }, { status: 400 });
  }
  if (typeof description !== "string" || !description.trim()) {
    return NextResponse.json({ error: "Excerpt is required" }, { status: 400 });
  }
  if (
    !Array.isArray(images) ||
    images.length === 0 ||
    !images.every((img) => typeof img === "string" && IMAGE_PATH_PATTERN.test(img))
  ) {
    return NextResponse.json({ error: "At least one image is required" }, { status: 400 });
  }
  if (
    liveUrl !== undefined &&
    liveUrl !== "" &&
    (typeof liveUrl !== "string" || !/^https?:\/\//i.test(liveUrl))
  ) {
    return NextResponse.json(
      { error: "Live preview URL must start with http:// or https://" },
      { status: 400 },
    );
  }

  const path = `src/content/case-studies/${slug}.json`;

  try {
    const existing = await getFileFromGitHub(path);
    if (!existing) {
      return NextResponse.json(
        { error: "Case study not found — it may have been removed" },
        { status: 404 },
      );
    }
    const previous = JSON.parse(existing.content) as Record<string, unknown>;

    const fileContent = JSON.stringify(
      {
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        images,
        date: typeof previous.date === "string" ? previous.date : new Date().toISOString().slice(0, 10),
        ...(typeof liveUrl === "string" && liveUrl ? { liveUrl } : {}),
      },
      null,
      2,
    );

    await upsertFileOnGitHub(
      path,
      Buffer.from(fileContent, "utf-8").toString("base64"),
      `Update case study: ${name.trim()}`,
      existing.sha,
    );

    return NextResponse.json({ slug });
  } catch (error) {
    console.error("Failed to update case study", error);
    return NextResponse.json(
      { error: "Something went wrong updating the case study. Check server logs for details." },
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

  const path = `src/content/case-studies/${slug}.json`;

  try {
    const existing = await getFileFromGitHub(path);
    if (!existing) {
      return NextResponse.json({ error: "Case study not found" }, { status: 404 });
    }

    await deleteFileOnGitHub(path, existing.sha, `Delete case study: ${slug}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete case study", error);
    return NextResponse.json(
      { error: "Something went wrong deleting the case study. Check server logs for details." },
      { status: 500 },
    );
  }
}
