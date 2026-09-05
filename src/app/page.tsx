import Image from "next/image";
import Link from "next/link";
import {
  Star,
  MapPin,
  Award,
  Globe2,
  ShoppingBag,
  Code2,
  SearchCheck,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CalendlyButton } from "@/components/integrations/calendly-button";
import { SectionHeading } from "@/components/sections/section-heading";
import { FaqSection } from "@/components/sections/faq-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { CtaBanner } from "@/components/sections/cta-banner";
import { siteConfig } from "@/lib/site-config";
import { generalFaqs } from "@/lib/content";
import { getAllCaseStudies } from "@/lib/case-studies";

const stats = [
  { icon: Star, value: "5.0", label: "Average Rating" },
  { icon: Globe2, value: "4+", label: "Countries Served" },
  { icon: Award, value: "Verified", label: "Shopify Partner" },
];

const services = [
  {
    icon: ShoppingBag,
    title: "Shopify Store Setup & Growth",
    description:
      "Store builds, theme customization, and conversion-focused product pages for founders shipping on Shopify.",
  },
  {
    icon: Code2,
    title: "Website Design & Development",
    description:
      "Fast, clean, mobile-first websites for businesses, portfolios, and service brands.",
  },
  {
    icon: SearchCheck,
    title: "Website & SEO Audits",
    description:
      "A clear breakdown of what's holding your site back — issues, revenue leaks, and quick wins.",
  },
  {
    icon: TrendingUp,
    title: "Conversion Rate Optimization",
    description:
      "Structural and copy improvements aimed at turning more visitors into paying customers.",
  },
];

export default function Home() {
  const portfolioPreview = getAllCaseStudies().slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="bg-surface-muted">
        <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-24">
          <div>
            <Badge variant="brand" className="mb-5">
              Shopify Partner · Web Architect
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              {siteConfig.founder}
            </h1>
            <p className="mt-2 text-lg font-medium text-brand">
              {siteConfig.founderTitle}, {siteConfig.name}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1">
                <span className="flex text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </span>
                <span className="font-semibold text-ink">5.0</span>
                (verified reviews)
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {siteConfig.location}
              </span>
            </div>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
              {siteConfig.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/contact">Contact Me</Link>
              </Button>
              <CalendlyButton variant="outline" size="lg">
                Book a Call
              </CalendlyButton>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-56 overflow-hidden rounded-full border-4 border-brand shadow-lg sm:w-72 lg:w-full">
            <Image
              src="/images/founder-headshot.jpg"
              alt={siteConfig.founder}
              fill
              sizes="320px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container-page grid gap-5 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="flex flex-col items-center gap-2 p-8 text-center">
              <stat.icon className="h-7 w-7 text-brand" />
              <p className="text-3xl font-bold text-ink">{stat.value}</p>
              <p className="text-sm text-muted">{stat.label}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-surface-muted py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="What I Do"
            title="Services Built to Drive Results"
            description="Specialized skills focused on one outcome: a site that grows your business."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Card key={service.title} className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50">
                  <service.icon className="h-5 w-5 text-brand" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-ink">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {service.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio preview */}
      <section className="py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Recent Work"
            title="Project Showcase"
            description="A sample of real projects and results — full case studies below."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {portfolioPreview.map((project) => {
              const href = project.liveUrl ?? project.flickrUrl;
              const card = (
                <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                  <div className="relative h-40 w-full">
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
                    <p className="mt-1 text-sm font-semibold text-ink">
                      {project.name}
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
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/case-studies">
                View All Case Studies <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <TestimonialsSection id="testimonials" />

      {/* Free audit CTA */}
      <section className="py-20">
        <div className="container-page">
          <Card className="mx-auto max-w-3xl p-8 text-center sm:p-12">
            <Badge variant="brand" className="mx-auto mb-4">
              Free Tool
            </Badge>
            <h2 className="text-2xl font-bold text-ink sm:text-3xl">
              Get a Free Website Audit
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted">
              Paste your website or Shopify store URL and get an instant
              scan of your on-page SEO, crawlability, store policies, and
              more — plus an optional full Lighthouse speed check, no
              waiting on an email.
            </p>
            <div className="mt-6 flex justify-center">
              <Button asChild size="lg">
                <Link href="/audit">Run My Free Audit</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <FaqSection id="faq" items={generalFaqs} />

      <CtaBanner
        title="Ready to Start Your Project?"
        description="Drop me a message or book a free call. Let's talk about your website vision."
      />
    </>
  );
}
