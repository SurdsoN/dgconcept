"use client";

import { useForm, ValidationError } from "@formspree/react";
import { Send, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function ContactForm() {
  const [state, handleSubmit] = useForm(siteConfig.formspreeId);

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
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <ValidationError
        errors={state.errors}
        className="flex items-center gap-2 text-sm text-brand"
      />

      <Button type="submit" className="w-full" disabled={state.submitting}>
        {state.submitting ? "Sending..." : "Send Message"}
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
