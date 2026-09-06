import { NextResponse, type NextRequest } from "next/server";
import { geolocation } from "@vercel/functions";
import toolAccessData from "@/content/settings/tool-access.json";
import type { ToolId } from "@/lib/tool-access";

// Statically imported (not read via fs at request time) so the data is
// baked into this file's own bundle at build time — proxy.ts runs in an
// isolated environment that shouldn't rely on shared runtime modules.
const toolAccess: Record<ToolId, string[]> = {
  audit: toolAccessData.audit ?? [],
  "roi-calculator": toolAccessData["roi-calculator"] ?? [],
  "free-guide": toolAccessData["free-guide"] ?? [],
};

// Maps a request path to the tool whose restrictions (set from the admin
// Access tab) govern it. Each tool blocks its page plus any API route(s)
// that page calls, so blocking only the page wouldn't be a real block.
function resolveTool(pathname: string): ToolId | null {
  if (pathname === "/audit" || pathname === "/api/audit" || pathname === "/api/audit/speed") {
    return "audit";
  }
  if (pathname === "/roi-calculator") {
    return "roi-calculator";
  }
  if (
    pathname === "/free-guide" ||
    pathname === "/downloads/dgconcept-dropshipping-guide.pdf" ||
    pathname === "/api/leads/submit"
  ) {
    return "free-guide";
  }
  return null;
}

// Runs only on Vercel, which is what supplies geolocation.
export function proxy(request: NextRequest) {
  const tool = resolveTool(request.nextUrl.pathname);
  if (!tool) return NextResponse.next();

  const { country } = geolocation(request);
  if (!country || !toolAccess[tool].includes(country)) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "This isn't available in your region." },
      { status: 403 },
    );
  }

  return NextResponse.redirect(new URL("/access-denied", request.url));
}

export const config = {
  matcher: [
    "/audit",
    "/api/audit",
    "/api/audit/speed",
    "/roi-calculator",
    "/free-guide",
    "/downloads/dgconcept-dropshipping-guide.pdf",
    "/api/leads/submit",
  ],
};
