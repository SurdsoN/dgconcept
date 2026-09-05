"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminTabs } from "@/components/admin/admin-tabs";
import type { Review } from "@/lib/reviews";

export function ReviewDashboard({ reviews }: { reviews: Review[] }) {
  const router = useRouter();
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDecision = async (slug: string, decision: "approve" | "reject") => {
    setPendingSlug(slug);
    setError(null);
    try {
      const res = await fetch(`/api/admin/reviews/${slug}`, {
        method: decision === "approve" ? "PATCH" : "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setPendingSlug(null);
        return;
      }
      router.refresh();
    } catch {
      setError("Network error — please try again.");
      setPendingSlug(null);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  return (
    <section className="py-16 lg:py-20">
      <div className="container-page max-w-3xl">
        <AdminTabs active="reviews" pendingReviewCount={reviews.length} />

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink">Pending Reviews</h1>
            <p className="mt-1 text-sm text-muted">
              Approve a review to publish it on /reviews, or reject it to
              remove it for good.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
            Log Out
          </Button>
        </div>

        {error && <p className="mt-4 text-sm text-brand">{error}</p>}

        <div className="mt-8 space-y-4">
          {reviews.map((review) => (
            <Card key={review.slug} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex gap-0.5 text-accent">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                  <div className="mt-3">
                    <p className="text-sm font-semibold text-ink">{review.name}</p>
                    {review.company && (
                      <p className="text-xs text-muted">{review.company}</p>
                    )}
                    <p className="text-xs text-muted">{review.date}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    size="sm"
                    disabled={pendingSlug === review.slug}
                    onClick={() => handleDecision(review.slug, "approve")}
                  >
                    <Check className="h-4 w-4" /> Approve
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={pendingSlug === review.slug}
                    onClick={() => handleDecision(review.slug, "reject")}
                  >
                    <X className="h-4 w-4" /> Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {reviews.length === 0 && (
            <p className="text-sm text-muted">No pending reviews right now.</p>
          )}
        </div>
      </div>
    </section>
  );
}
