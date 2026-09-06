import type { Metadata } from "next";
import { Hand } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Access Denied",
  robots: { index: false, follow: false },
};

const OCTAGON_CLIP =
  "polygon(29.3% 0%, 70.7% 0%, 100% 29.3%, 100% 70.7%, 70.7% 100%, 29.3% 100%, 0% 70.7%, 0% 29.3%)";

export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <div
        className="flex h-40 w-40 items-center justify-center bg-brand p-2"
        style={{ clipPath: OCTAGON_CLIP }}
      >
        <div
          className="flex h-full w-full items-center justify-center bg-white p-2"
          style={{ clipPath: OCTAGON_CLIP }}
        >
          <div
            className="flex h-full w-full items-center justify-center bg-brand"
            style={{ clipPath: OCTAGON_CLIP }}
          >
            <Hand className="h-16 w-16 text-white" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-ink sm:text-4xl">Access Denied</h1>
      <p className="max-w-md text-sm text-muted">
        The site owner has restricted access to this page from your region.
        Please contact {siteConfig.email} if you believe this is a mistake.
      </p>
    </div>
  );
}
