"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { useForm, ValidationError } from "@formspree/react";
import ReCAPTCHA from "react-google-recaptcha";
import { Send, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function ContactForm() {
  const [state, handleSubmit] = useForm(siteConfig.formspreeId);
  const [verified, setVerified] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const websitePrefill = mounted
    ? (new URLSearchParams(window.location.search).get("url") ?? "")
    : "";

  // reCAPTCHA's "normal" size renders a fixed 304px-wide widget, which
  // overflows the card on phone-width screens — switch to "compact" below
  // the breakpoint where it no longer fits.
  const recaptchaSize = useSyncExternalStore<"compact" | "normal">(
    (onChange) => {
      const mql = window.matchMedia("(max-width: 400px)");
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => (window.matchMedia("(max-width: 400px)").matches ? "compact" : "normal"),
    () => "normal",
  );

  if (state.succeeded) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface-muted p-10 text-center">
        <CheckCircle2 className="h-8 w-8 text-brand" />
        <p className="font-semibold text-ink">Message sent!</p>
        <p className="text-sm text-muted">
          Thanks for reaching out — I&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
        recaptchaRef.current?.reset();
        setVerified(false);
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
          Your Name
        </label>
        <Input id="name" name="name" placeholder="John Smith" required />
        <ValidationError
          prefix="Name"
          field="name"
          errors={state.errors}
          className="mt-1.5 text-xs text-brand"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
          Email Address
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          required
        />
        <ValidationError
          prefix="Email"
          field="email"
          errors={state.errors}
          className="mt-1.5 text-xs text-brand"
        />
      </div>
      <div>
        <label htmlFor="website" className="mb-1.5 block text-sm font-medium text-ink">
          Website URL <span className="font-normal text-muted">(optional)</span>
        </label>
        <Input
          key={mounted ? "prefilled" : "empty"}
          id="website"
          name="website"
          type="url"
          placeholder="https://yourstore.com"
          defaultValue={websitePrefill}
        />
        <ValidationError
          prefix="Website"
          field="website"
          errors={state.errors}
          className="mt-1.5 text-xs text-brand"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink">
          Your Message
        </label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell me about your project..."
          required
        />
        <ValidationError
          prefix="Message"
          field="message"
          errors={state.errors}
          className="mt-1.5 text-xs text-brand"
        />
      </div>

      <div className="flex justify-center sm:justify-start">
        <ReCAPTCHA
          key={recaptchaSize}
          ref={recaptchaRef}
          sitekey={siteConfig.recaptchaSiteKey}
          size={recaptchaSize}
          onChange={(token) => setVerified(!!token)}
          onExpired={() => setVerified(false)}
        />
      </div>

      <ValidationError
        errors={state.errors}
        className="flex items-center gap-2 text-sm text-brand"
      />

      <Button
        type="submit"
        className="w-full"
        disabled={state.submitting || !verified}
      >
        {state.submitting ? "Sending..." : "Send Message"}
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
