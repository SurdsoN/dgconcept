import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, isSessionTokenValid } from "@/lib/admin-auth";
import { getFileFromGitHub, upsertFileOnGitHub } from "@/lib/github-publish";
import { SLUG_PATTERN } from "@/lib/slug";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB, matches the client-side 3MB cap with headroom

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

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

  const { slug, mimeType, contentBase64 } = (body ?? {}) as Record<string, unknown>;

  if (typeof slug !== "string" || !SLUG_PATTERN.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }
  if (typeof mimeType !== "string" || !(mimeType in EXTENSION_BY_MIME)) {
    return NextResponse.json(
      { error: "Unsupported image type — please use JPG, PNG, WEBP, or GIF" },
      { status: 400 },
    );
  }
  if (typeof contentBase64 !== "string" || !contentBase64) {
    return NextResponse.json({ error: "Missing image data" }, { status: 400 });
  }

  const base64 = contentBase64.replace(/^data:[^;]+;base64,/, "");
  const byteLength = Buffer.from(base64, "base64").length;
  if (byteLength > MAX_BYTES) {
    return NextResponse.json({ error: "Image is too large — please choose one under 5MB" }, { status: 400 });
  }

  const ext = EXTENSION_BY_MIME[mimeType];
  const path = `public/images/blog/${slug}.${ext}`;

  try {
    const existing = await getFileFromGitHub(path);
    await upsertFileOnGitHub(
      path,
      base64,
      `Add featured image for blog post: ${slug}`,
      existing?.sha,
    );

    return NextResponse.json({ path: `/images/blog/${slug}.${ext}` });
  } catch (error) {
    console.error("Failed to upload blog post image", error);
    return NextResponse.json(
      { error: "Something went wrong uploading the image. Check server logs for details." },
      { status: 500 },
    );
  }
}
