import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { WebsiteAuditTool } from "@/components/website-audit-tool";

export const metadata: Metadata = {
  title: "Free Website Audit",
  description:
    "Get a real, instant Lighthouse-powered audit of your website or Shopify store — speed, SEO, and mobile-friendliness checks, no signup required.",
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
            Paste your website or Shopify store URL below for a real, live
            audit — speed, SEO, and mobile-friendliness checks, powered by
            Google&apos;s own PageSpeed Insights. No signup, no waiting on
            an email.
          </p>
        </div>

        <div className="mt-12">
          <WebsiteAuditTool />
        </div>
      </div>
    </section>
  );
}
