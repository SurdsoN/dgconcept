import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, isSessionTokenValid } from "@/lib/admin-auth";
import { getFileFromGitHub, upsertFileOnGitHub } from "@/lib/github-publish";
import { TOOLS } from "@/lib/tool-access";
import { COUNTRIES } from "@/lib/countries";

export const runtime = "nodejs";

const VALID_CODES = new Set(COUNTRIES.map((c) => c.code));
const PATH = "src/content/settings/tool-access.json";

export async function PUT(request: NextRequest) {
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

  const data = (body ?? {}) as Record<string, unknown>;
  const next: Record<string, string[]> = {};

  for (const tool of TOOLS) {
    const value = data[tool.id];
    if (!Array.isArray(value) || !value.every((code) => typeof code === "string" && VALID_CODES.has(code))) {
      return NextResponse.json(
        { error: `Invalid country list for "${tool.label}"` },
        { status: 400 },
      );
    }
    next[tool.id] = value;
  }

  try {
    const existing = await getFileFromGitHub(PATH);
    await upsertFileOnGitHub(
      PATH,
      Buffer.from(JSON.stringify(next, null, 2), "utf-8").toString("base64"),
      "Update tool access restrictions",
      existing?.sha,
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to update tool access restrictions", error);
    return NextResponse.json(
      { error: "Something went wrong saving restrictions. Check server logs for details." },
      { status: 500 },
    );
  }
}
