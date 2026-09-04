import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendlyButton } from "@/components/integrations/calendly-button";

export function CtaBanner({
  title,
  description,
  primaryLabel = "Start a Project",
  primaryHref = "/contact",
  showCalendly = true,
}: {
  title: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
  showCalendly?: boolean;
}) {
  return (
    <section className="py-20">
      <div className="container-page">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-accent px-8 py-14 text-center sm:px-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/90 sm:text-base">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="dark" size="lg">
              <Link href={primaryHref}>{primaryLabel} →</Link>
            </Button>
            {showCalendly && (
              <CalendlyButton variant="outlineInverse" size="lg">
                Book a Call
              </CalendlyButton>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
