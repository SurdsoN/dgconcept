import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CtaBanner } from "@/components/sections/cta-banner";
import { getAllCaseStudies, getCaseStudyCategories } from "@/lib/case-studies";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Selected website and Shopify store projects.",
};

export default async function CaseStudiesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const allCaseStudies = getAllCaseStudies();
  const categories = getCaseStudyCategories(allCaseStudies);
  const filtered = category
    ? allCaseStudies.filter((project) => project.category === category)
    : allCaseStudies;

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
            world.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page">
          {categories.length > 1 && (
            <div className="mb-8 flex flex-wrap gap-2">
              <Link
                href="/case-studies"
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  !category
                    ? "bg-brand text-white"
                    : "border border-border text-muted hover:border-brand hover:text-brand"
                }`}
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/case-studies?category=${encodeURIComponent(cat)}`}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    category === cat
                      ? "bg-brand text-white"
                      : "border border-border text-muted hover:border-brand hover:text-brand"
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => {
              const href = project.liveUrl ?? project.flickrUrl;
              const card = (
                <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                  <div className="relative h-44 w-full">
                    <Image
                      src={project.images[0]}
                      alt={project.name}
                      fill
                      sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
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
              );

              return href ? (
                <a key={project.slug} href={href} target="_blank" rel="noopener noreferrer">
                  {card}
                </a>
              ) : (
                <div key={project.slug}>{card}</div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-muted">
              No case studies in this category yet.
            </p>
          )}
        </div>

        <div className="container-page mt-4 text-center">
          <Button asChild variant="outline">
            <a href={siteConfig.socials.flickr} target="_blank" rel="noopener noreferrer">
              More Case Studies <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>

      <CtaBanner
        title="Want Results Like These For Your Business?"
        description="Let's talk about what a site built for conversions could look like for you."
      />
    </>
  );
}
