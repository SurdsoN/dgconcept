import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, MessageCircle, Headphones } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";
import { CalendlyButton } from "@/components/integrations/calendly-button";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch to talk about your website or Shopify project.",
};

const reasons = [
  {
    icon: Clock,
    title: "Quick Response",
    description: "Get answers within hours.",
  },
  {
    icon: MessageCircle,
    title: "Direct Contact",
    description: "No bots, just a real conversation.",
  },
  {
    icon: Headphones,
    title: "Always Available",
    description: "Ready when you are.",
  },
];

export default function ContactPage() {
  return (
    <section className="py-16 lg:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="brand" className="mb-4">
            Get In Touch
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Ready to Start Your Project?
          </h1>
          <p className="mt-4 text-base text-muted">
            Drop a message or reach out on WhatsApp. Let&apos;s talk about your
            website vision.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card className="p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-ink">Send a Message</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-ink">Contact Details</h2>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-muted">Email</p>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="break-words font-medium text-ink"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-muted">Phone</p>
                    <a
                      href={`tel:${siteConfig.phone}`}
                      className="break-words font-medium text-ink"
                    >
                      {siteConfig.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted">Location</p>
                    <p className="font-medium text-ink">{siteConfig.location}</p>
                  </div>
                </li>
              </ul>
            </Card>

            <Card className="divide-y divide-border p-0">
              {reasons.map((reason) => (
                <div key={reason.title} className="flex items-start gap-3 p-4">
                  <reason.icon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <div>
                    <p className="text-sm font-semibold text-ink">{reason.title}</p>
                    <p className="text-xs text-muted">{reason.description}</p>
                  </div>
                </div>
              ))}
            </Card>

            <Card className="border-none bg-gradient-to-br from-brand to-accent p-6 text-center text-white">
              <h3 className="text-lg font-semibold">Let&apos;s Connect</h3>
              <p className="mt-1 text-sm text-white/90">
                Book a free call to bring your website vision to life.
              </p>
              <div className="mt-4 flex justify-center">
                <CalendlyButton variant="dark">Book a Call</CalendlyButton>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
