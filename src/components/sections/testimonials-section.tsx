import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "./section-heading";
import { testimonials } from "@/lib/content";

export function TestimonialsSection({ id }: { id?: string }) {
  return (
    <section id={id} className="bg-surface-muted py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Client Feedback"
          title="What Clients Are Saying"
          description="Real reviews from real clients who trusted DgConcept with their projects."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={`${t.name}-${t.location}`} className="p-6">
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-5">
                <p className="text-sm font-semibold text-ink">{t.name}</p>
                <p className="text-xs text-muted">{t.location}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
