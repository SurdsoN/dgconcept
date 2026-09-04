import Image from "next/image";
import type { Metadata } from "next";
import { Star, Globe2, Award, Target, ShieldCheck, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { CtaBanner } from "@/components/sections/cta-banner";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: `Meet ${siteConfig.founder}, the web architect behind ${siteConfig.name}.`,
};

const trackRecord = [
  { icon: Star, value: "5.0", label: "Average Rating" },
  { icon: Globe2, value: "4+", label: "Countries Served" },
  { icon: Award, value: "Verified", label: "Shopify Partner" },
];

const principles = [
  {
    icon: Target,
    title: "Conversion First",
    description:
      "Every page, layout, and checkout flow is designed to turn visitors into paying customers — not just look good.",
  },
  {
    icon: Layers,
    title: "Built for Scale",
    description:
      "Sites are structured so they can grow with your business, without needing a costly rebuild later.",
  },
  {
    icon: ShieldCheck,
    title: "Honest Partnership",
    description:
      "Clear timelines, real communication, and zero ghosting. You always know what's happening with your project.",
  },
];

const process = [
  {
    step: "01",
    title: "Discovery",
    description: "A short call to understand your goals, brand, and what a win looks like.",
  },
  {
    step: "02",
    title: "Design",
    description: "Layout and visual direction built around your brand and your customers.",
  },
  {
    step: "03",
    title: "Build",
    description: "Development, content upload, and testing across devices before anything goes live.",
  },
  {
    step: "04",
    title: "Launch & Support",
    description: "A guided launch plus a post-launch support window to fix anything that comes up.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-surface-muted">
        <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <Badge variant="brand" className="mb-5">
              About {siteConfig.name}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Building Websites That{" "}
              <span className="text-brand">Actually Convert</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted">
              {siteConfig.name} is led by {siteConfig.founder}, a professional
              web architect with long-term, impactful experience in website
              design and development. As Founder and Operating Officer, the
              mission is simple: build fast, clean, profitable websites and
              Shopify stores for founders worldwide.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="/contact">Work With {siteConfig.founder.split(" ")[0]}</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="/case-studies">View Portfolio</a>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto aspect-[4/5] w-64 overflow-hidden rounded-3xl shadow-lg sm:w-80">
            <Image
              src="/images/founder-headshot.jpg"
              alt={siteConfig.founder}
              fill
              sizes="320px"
              className="object-cover"
              priority
            />
            <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-white/95 px-4 py-2 text-sm shadow">
              <p className="font-semibold text-ink">{siteConfig.founder}</p>
              <p className="text-xs text-muted">{siteConfig.founderTitle}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page grid gap-5 sm:grid-cols-3">
          {trackRecord.map((stat) => (
            <Card key={stat.label} className="flex flex-col items-center gap-2 p-8 text-center">
              <stat.icon className="h-7 w-7 text-brand" />
              <p className="text-3xl font-bold text-ink">{stat.value}</p>
              <p className="text-sm text-muted">{stat.label}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-surface-muted py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our Mission"
            title="Helping Businesses Win Online"
            description="A great website is more than design — it's a growth engine. Every project is built around three core principles."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {principles.map((p) => (
              <Card key={p.title} className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50">
                  <p.icon className="h-5 w-5 text-brand" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-ink">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {p.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="How I Work"
            title="A Simple, Transparent Process"
            description="From first call to launch day, here's what working together looks like."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <Card key={p.step} className="p-6">
                <span className="text-sm font-bold text-brand">{p.step}</span>
                <h3 className="mt-2 text-base font-semibold text-ink">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {p.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Ready to Build Your Next Winning Site?"
        description="Let's turn your idea into a website that loads fast, looks premium, and brings real revenue."
        primaryLabel="Start a Project"
      />
    </>
  );
}
