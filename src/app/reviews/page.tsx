import type { Metadata } from "next";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ReviewForm } from "@/components/review-form";
import { getApprovedReviews } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Client Reviews",
  description: "Real reviews from real clients who trusted DgConcept with their projects.",
};

export default function ReviewsPage() {
  const reviews = getApprovedReviews();

  return (
    <>
      <section className="bg-surface-muted">
        <div className="container-page py-16 lg:py-20">
          <Badge variant="brand" className="mb-4">
            Client Reviews
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            What Clients Are Saying
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted">
            Real reviews from real clients who trusted DgConcept with their
            projects — worked with me? Share your own below.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-page">
          {reviews.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <Card key={review.slug} className="flex flex-col p-6">
                  <div className="flex gap-0.5 text-accent">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ink">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                  <div className="mt-5">
                    <p className="text-sm font-semibold text-ink">{review.name}</p>
                    {review.company && (
                      <p className="text-xs text-muted">{review.company}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted">
              No reviews yet — be the first to share your experience below.
            </p>
          )}
        </div>
      </section>

      <section className="bg-surface-muted py-16 lg:py-20">
        <div className="container-page max-w-xl">
          <h2 className="text-2xl font-bold text-ink">Leave a Review</h2>
          <p className="mt-2 text-sm text-muted">
            Worked with DgConcept? Share your experience — it helps other
            founders trust the process.
          </p>
          <div className="mt-6">
            <ReviewForm />
          </div>
        </div>
      </section>
    </>
  );
}
