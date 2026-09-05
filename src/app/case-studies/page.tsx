import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CtaBanner } from "@/components/sections/cta-banner";
import { projects } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

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
            world.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Card key={`${project.name}-${i}`} className="overflow-hidden">
              <div className="relative h-44 w-full">
                <Image
                  src={project.image}
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
          ))}
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
