import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { WebsiteAuditTool } from "@/components/website-audit-tool";

export const metadata: Metadata = {
  title: "Free Website Audit",
  description:
    "Get an instant on-page SEO, crawlability, and store health scan of your website or Shopify store — plus an optional full Google Lighthouse speed audit. No signup required.",
};

export default function AuditPage() {
  return (
    <section className="py-16 lg:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="brand" className="mb-4">
            Free Tool
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Free Website <span className="text-brand">Audit</span>
          </h1>
          <p className="mt-4 text-base text-muted">
            Paste your website or Shopify store URL for an instant scan —
            on-page SEO, crawlability, navigation, store policies, contact
            info, and installed apps, all in a few seconds. Want real Speed
            and Lighthouse scores too? Run that separately, right from the
            results. No signup, no waiting on an email.
          </p>
        </div>

        <div className="mt-12">
          <WebsiteAuditTool />
        </div>
      </div>
    </section>
  );
}
