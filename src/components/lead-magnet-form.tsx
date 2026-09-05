"use client";

import { useRef, useState, type FormEvent } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { CheckCircle2, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function LeadMagnetForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
      const res = await fetch("/api/leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, recaptchaToken }),
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
        <p className="font-semibold text-ink">Check your inbox!</p>
        <p className="text-sm text-muted">
          Your free copy of The Ultimate Dropshipping Guide is on its way to{" "}
          <span className="font-medium text-ink">{email}</span>.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="lead-name" className="mb-1.5 block text-sm font-medium text-ink">
            Your Name
          </label>
          <Input
            id="lead-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            required
          />
        </div>
        <div>
          <label htmlFor="lead-email" className="mb-1.5 block text-sm font-medium text-ink">
            Email Address
          </label>
          <Input
            id="lead-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
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

        <Button type="submit" disabled={status === "loading" || !verified} className="w-full">
          {status === "loading" ? "Sending..." : "Send Me the Free Guide"}
          <Download className="h-4 w-4" />
        </Button>
        <p className="text-xs text-muted">
          No spam, ever. Just the guide, straight to your inbox.
        </p>
      </form>
    </Card>
  );
}
