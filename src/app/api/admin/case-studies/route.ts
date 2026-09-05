import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, isSessionTokenValid } from "@/lib/admin-auth";
import { getFileFromGitHub, upsertFileOnGitHub } from "@/lib/github-publish";
import { slugify, SLUG_PATTERN } from "@/lib/slug";
import { CASE_STUDY_IMAGE_PATH_PATTERN as IMAGE_PATH_PATTERN } from "@/lib/case-study-image-path";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  if (!isSessionTokenValid(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, category, description, images, liveUrl, slug: rawSlug } = (body ?? {}) as Record<
    string,
    unknown
  >;

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

  const slug = slugify(typeof rawSlug === "string" && rawSlug.trim() ? rawSlug : name);
  if (!slug || !SLUG_PATTERN.test(slug)) {
    return NextResponse.json(
      { error: "Could not build a valid slug — try a different name" },
      { status: 400 },
    );
  }

  const path = `src/content/case-studies/${slug}.json`;

  try {
    const existing = await getFileFromGitHub(path);
    if (existing) {
      return NextResponse.json(
        { error: `A case study with the slug "${slug}" already exists — try a different name` },
        { status: 409 },
      );
    }

    const fileContent = JSON.stringify(
      {
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        images,
        date: new Date().toISOString().slice(0, 10),
        ...(typeof liveUrl === "string" && liveUrl ? { liveUrl } : {}),
      },
      null,
      2,
    );

    await upsertFileOnGitHub(
      path,
      Buffer.from(fileContent, "utf-8").toString("base64"),
      `Add case study: ${name.trim()}`,
    );

    return NextResponse.json({ slug });
  } catch (error) {
    console.error("Failed to publish case study", error);
    return NextResponse.json(
      { error: "Something went wrong publishing the case study. Check server logs for details." },
      { status: 500 },
    );
  }
}
