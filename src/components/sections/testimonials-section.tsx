import Link from "next/link";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "./section-heading";
import { testimonials } from "@/lib/content";

const featuredTestimonials = testimonials.filter(
  (t) => t.name !== "Verified Client",
);

export function TestimonialsSection({ id }: { id?: string }) {
  return (
    <section id={id} className="bg-surface-muted py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Client Feedback"
          title="What Clients Are Saying"
          description="Real reviews from real clients who trusted DgConcept with their projects."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3 lg:grid-rows-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-ink to-black lg:aspect-auto lg:row-span-2">
            <video
              className="h-full w-full object-cover"
              src="/videos/mariana-testimonial.mp4"
              controls
              playsInline
              preload="metadata"
            >
              Your browser does not support embedded video.
            </video>
          </div>

          {featuredTestimonials.map((t) => (
            <Card key={`${t.name}-${t.location}`} className="flex flex-col p-6">
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

          <Card className="flex flex-col items-center justify-center border-none bg-gradient-to-br from-brand to-accent p-6 text-center text-white">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <p className="mt-3 text-3xl font-bold">5.0</p>
            <p className="mt-1 text-sm text-white/90">
              Based on {testimonials.length}+ verified client reviews
            </p>
          </Card>
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          Worked with DgConcept?{" "}
          <Link href="/reviews" className="font-medium text-brand hover:underline">
            Read more reviews or leave your own
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
