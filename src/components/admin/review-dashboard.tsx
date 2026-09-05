"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Check, X, Trash2, BadgeCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminTabs } from "@/components/admin/admin-tabs";
import type { Review } from "@/lib/reviews";

export function ReviewDashboard({
  reviews,
  approvedReviews,
}: {
  reviews: Review[];
  approvedReviews: Review[];
}) {
  const router = useRouter();
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDecision = async (slug: string, decision: "approve" | "reject" | "delete") => {
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

  const handleDeletePublished = async (review: Review) => {
    if (!window.confirm(`Delete the live review from "${review.name}"? This can't be undone.`)) {
      return;
    }
    await handleDecision(review.slug, "delete");
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

        <div className="mt-12">
          <h2 className="text-lg font-semibold text-ink">Published Reviews</h2>
          <p className="mt-1 text-xs text-muted">
            Live on /reviews. Delete removes one for good — there&apos;s no
            edit option since it&apos;s a client&apos;s own words.
          </p>
          <div className="mt-4 space-y-4">
            {approvedReviews.map((review) => (
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
                    <div className="mt-3 flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-ink">{review.name}</p>
                      <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    {review.company && (
                      <p className="text-xs text-muted">{review.company}</p>
                    )}
                    <p className="text-xs text-muted">{review.date}</p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={pendingSlug === review.slug}
                    onClick={() => handleDeletePublished(review)}
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </div>
              </Card>
            ))}
            {approvedReviews.length === 0 && (
              <p className="text-sm text-muted">No published reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
