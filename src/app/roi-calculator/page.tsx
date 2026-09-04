import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { RoiCalculator } from "@/components/roi-calculator";

export const metadata: Metadata = {
  title: "ROI Calculator",
  description:
    "See how small improvements in conversion rate and average order value can transform your revenue.",
};

export default function RoiCalculatorPage() {
  return (
    <section className="py-16 lg:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="brand" className="mb-4">
            DgConcept ROI Calculator
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Calculate Your <span className="text-brand">Revenue Potential</span>
          </h1>
          <p className="mt-4 text-base text-muted">
            See how small improvements in conversion rate and average order
            value can transform your website or Shopify store revenue.
          </p>
        </div>

        <div className="mt-12">
          <RoiCalculator />
        </div>
      </div>
    </section>
  );
}
