import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, isSessionTokenValid } from "@/lib/admin-auth";
import { deleteFileOnGitHub, getFileFromGitHub } from "@/lib/github-publish";

export const runtime = "nodejs";

const LEAD_ID_PATTERN = /^[0-9]+-[a-z0-9]+$/;

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  if (!isSessionTokenValid(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!LEAD_ID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Invalid lead" }, { status: 400 });
  }

  const path = `src/content/leads/${id}.json`;

  try {
    const existing = await getFileFromGitHub(path);
    if (!existing) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    await deleteFileOnGitHub(path, existing.sha, `Delete lead: ${id}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete lead", error);
    return NextResponse.json(
      { error: "Something went wrong deleting the lead. Check server logs for details." },
      { status: 500 },
    );
  }
}
