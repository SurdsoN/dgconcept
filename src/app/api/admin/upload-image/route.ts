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

const ALLOWED_FOLDERS = ["blog", "case-studies"] as const;
type AllowedFolder = (typeof ALLOWED_FOLDERS)[number];

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

  const { folder, slug, index, mimeType, contentBase64 } = (body ?? {}) as Record<string, unknown>;

  if (typeof folder !== "string" || !ALLOWED_FOLDERS.includes(folder as AllowedFolder)) {
    return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
  }
  if (typeof slug !== "string" || !SLUG_PATTERN.test(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }
  if (index !== undefined && (typeof index !== "number" || !Number.isInteger(index) || index < 0)) {
    return NextResponse.json({ error: "Invalid index" }, { status: 400 });
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
  const filename = index !== undefined ? `${slug}-${index}.${ext}` : `${slug}.${ext}`;
  const path = `public/images/${folder}/${filename}`;

  try {
    const existing = await getFileFromGitHub(path);
    await upsertFileOnGitHub(path, base64, `Add image: ${filename}`, existing?.sha);

    return NextResponse.json({ path: `/images/${folder}/${filename}` });
  } catch (error) {
    console.error("Failed to upload image", error);
    return NextResponse.json(
      { error: "Something went wrong uploading the image. Check server logs for details." },
      { status: 500 },
    );
  }
}
