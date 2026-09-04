import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CtaBanner } from "@/components/sections/cta-banner";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Selected website and Shopify store projects.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <section className="bg-surface-muted">
        <div className="container-page py-16 lg:py-20">
          <Badge variant="brand" className="mb-4">
            Portfolio
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Case Studies &amp; Portfolio
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted">
            Selected websites and Shopify stores built for founders around the
            world. This section is ready for real project screenshots and
            results — swap in the details below as projects are added.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Card key={`${project.name}-${i}`} className="overflow-hidden">
              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-brand to-accent text-sm font-medium text-white/80">
                Add project screenshot
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                  {project.category}
                </p>
                <p className="mt-1 text-base font-semibold text-ink">
                  {project.name}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Want Results Like These For Your Business?"
        description="Let's talk about what a site built for conversions could look like for you."
      />
    </>
  );
}
