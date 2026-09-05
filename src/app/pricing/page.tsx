import Link from "next/link";
import type { Metadata } from "next";
import { Check, Rocket, TrendingUp, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { FaqSection } from "@/components/sections/faq-section";
import { CtaBanner } from "@/components/sections/cta-banner";
import { PricingQuiz } from "@/components/pricing-quiz";
import { pricingTiers, comparisonRows, pricingFaqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Website and Shopify packages built around your goals, quoted after a short discovery call.",
};

const tierIcons = {
  launch: Rocket,
  growth: TrendingUp,
  scale: Crown,
};

export default function PricingPage() {
  return (
    <>
      <section className="bg-surface-muted">
        <div className="container-page py-16 text-center lg:py-20">
          <Badge variant="brand" className="mb-4">
            Premium Packages
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Pricing Built for Ambitious Founders
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted">
            Three packages designed to take you from launch to scale. Final
            pricing is tailored after a short discovery call so it fits your
            project, not a template.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page grid gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier) => {
            const Icon = tierIcons[tier.key as keyof typeof tierIcons];
            return (
              <Card
                key={tier.key}
                className={
                  tier.featured
                    ? "relative border-2 border-brand p-6 shadow-lg lg:-translate-y-3"
                    : "p-6"
                }
              >
                {tier.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-4 py-1 text-xs font-semibold text-white">
                    {tier.badge}
                  </span>
                )}
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50">
                  <Icon className="h-5 w-5 text-brand" />
                </div>
                <h2 className="mt-4 text-xl font-bold text-ink">{tier.name}</h2>
                <p className="mt-2 text-sm text-muted">{tier.tagline}</p>

                <div className="mt-6 rounded-xl bg-surface-muted p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Investment
                  </p>
                  <p className="mt-1 text-2xl font-bold text-ink">Custom Quote</p>
                  <p className="text-xs text-muted">Tailored after a short call</p>
                </div>

                <Button
                  asChild
                  variant={tier.featured ? "primary" : "outline"}
                  className="mt-6 w-full"
                >
                  <Link href="/contact">{tier.cta} →</Link>
                </Button>

                <ul className="mt-6 space-y-3 text-sm">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      <span className="text-ink">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="bg-surface-muted py-20">
        <div className="container-page">
          <SectionHeading
            title="Compare Every Package"
            description="A side-by-side look at what you get at each tier."
          />
          <div className="mt-10 overflow-x-auto rounded-2xl border border-border bg-surface">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted">
                  <th className="px-5 py-4 font-semibold text-ink">Feature</th>
                  <th className="px-5 py-4 font-semibold text-ink">Launch</th>
                  <th className="px-5 py-4 font-semibold text-brand">Growth</th>
                  <th className="px-5 py-4 font-semibold text-ink">Scale</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 === 1 ? "bg-surface-muted/50" : undefined}
                  >
                    <td className="px-5 py-3.5 text-ink">{row.feature}</td>
                    <td className="px-5 py-3.5 text-muted">{row.launch}</td>
                    <td className="px-5 py-3.5 text-muted">{row.growth}</td>
                    <td className="px-5 py-3.5 text-muted">{row.scale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Not Sure Which Package Fits?"
            title="Take the 30-Second Quiz"
            description="Answer a few quick questions and get a recommended starting point."
          />
          <div className="mt-10">
            <PricingQuiz tiers={pricingTiers} />
          </div>
        </div>
      </section>

      <FaqSection
        title="Pricing FAQ"
        description="Common questions about how pricing and packages work."
        items={pricingFaqs}
      />

      <CtaBanner
        title="Ready to Start Your Project?"
        description="Send me your website goals and I'll follow up with a custom quote within 24 hours."
        primaryLabel="Get Custom Quote"
      />
    </>
  );
}
