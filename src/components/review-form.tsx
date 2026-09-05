"use client";

import { useRef, useState, type FormEvent } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Star, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function ReviewForm() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [quote, setQuote] = useState("");
  const [verified, setVerified] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);

    try {
      const recaptchaToken = recaptchaRef.current?.getValue();
      const res = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, rating, quote, recaptchaToken }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        recaptchaRef.current?.reset();
        setVerified(false);
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setMessage("Network error — please try again.");
      recaptchaRef.current?.reset();
      setVerified(false);
    }
  };

  if (status === "success") {
    return (
      <Card className="flex flex-col items-center gap-3 p-10 text-center">
        <CheckCircle2 className="h-8 w-8 text-brand" />
        <p className="font-semibold text-ink">Thank you for your review!</p>
        <p className="text-sm text-muted">
          It&apos;s been submitted for approval and will appear here once reviewed.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="review-name" className="mb-1.5 block text-sm font-medium text-ink">
            Your Name
          </label>
          <Input
            id="review-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            required
          />
        </div>
        <div>
          <label htmlFor="review-company" className="mb-1.5 block text-sm font-medium text-ink">
            Company <span className="font-normal text-muted">(optional)</span>
          </label>
          <Input
            id="review-company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme Inc."
          />
        </div>
        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink">Rating</span>
          <div
            className="flex gap-1"
            onMouseLeave={() => setHoverRating(null)}
            role="radiogroup"
            aria-label="Rating"
          >
            {Array.from({ length: 5 }).map((_, i) => {
              const value = i + 1;
              const filled = value <= (hoverRating ?? rating);
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={value === rating}
                  aria-label={`${value} star${value > 1 ? "s" : ""}`}
                  onMouseEnter={() => setHoverRating(value)}
                  onClick={() => setRating(value)}
                  className="p-0.5 text-accent"
                >
                  <Star className={`h-6 w-6 ${filled ? "fill-current" : ""}`} />
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <label htmlFor="review-quote" className="mb-1.5 block text-sm font-medium text-ink">
            Your Review
          </label>
          <Textarea
            id="review-quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            rows={4}
            placeholder="Tell us about your experience working with DgConcept..."
            required
          />
        </div>

        <div className="flex justify-center sm:justify-start">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={siteConfig.recaptchaSiteKey}
            onChange={(token) => setVerified(!!token)}
            onExpired={() => setVerified(false)}
          />
        </div>

        {message && <p className="text-sm text-brand">{message}</p>}

        <Button type="submit" disabled={status === "loading" || !verified} className="w-full sm:w-auto">
          {status === "loading" ? "Submitting..." : "Submit Review"}
        </Button>
        <p className="text-xs text-muted">
          Reviews are checked before appearing publicly on the site.
        </p>
      </form>
    </Card>
  );
}
