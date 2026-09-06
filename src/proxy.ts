import { NextResponse, type NextRequest } from "next/server";
import { geolocation } from "@vercel/functions";
import { siteConfig } from "@/lib/site-config";

// Blocks visitors from countries in siteConfig.blockedCountries out of the
// lead-magnet funnel (the landing page, a direct link to the PDF, and the
// submission API — blocking only the page would leave the other two as an
// easy bypass). Runs only on Vercel, which is what supplies geolocation.
export function proxy(request: NextRequest) {
  const { country } = geolocation(request);
  const blockedCountries: readonly string[] = siteConfig.blockedCountries;
  if (!country || !blockedCountries.includes(country)) {
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
  matcher: ["/free-guide", "/downloads/dgconcept-dropshipping-guide.pdf", "/api/leads/submit"],
};
