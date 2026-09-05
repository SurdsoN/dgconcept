import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LeadMagnetForm } from "@/components/lead-magnet-form";

export const metadata: Metadata = {
  title: "Free Dropshipping Guide",
  description:
    "A free, no-fluff guide to Shopify dropshipping — what it is, the 5-step process, and what it actually takes to succeed.",
};

const highlights = [
  "What dropshipping actually is, and how the money moves",
  "The 5-step process: find products, build your store, market, sell, fulfill",
  "The 3 store types — niche, general, and one-product — and when to use each",
  "What it really takes to succeed (hint: it's not luck)",
];

export default function FreeGuidePage() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <Badge variant="brand" className="mb-4">
            Free Guide
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            The Free Dropshipping Guide
          </h1>
          <p className="mt-4 text-base text-muted">
            A short, practical walkthrough of Shopify dropshipping — built
            from real client work, not theory. Enter your email and it lands
            in your inbox in a couple of minutes.
          </p>

          <ul className="mt-8 space-y-3">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-ink">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <LeadMagnetForm />
        </div>
      </div>
    </section>
  );
}
