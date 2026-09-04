"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { AnnouncementBar } from "./announcement-bar";
import { CalendlyButton } from "@/components/integrations/calendly-button";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur">
      <AnnouncementBar />
      <div className="container-page flex h-16 items-center justify-between border-b border-border">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image
            src="/images/logo.png"
            alt={siteConfig.name}
            width={140}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink transition-colors hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <CalendlyButton variant="primary" size="sm">
            Book a Call
          </CalendlyButton>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-b border-border bg-white lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-3">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-ink hover:bg-surface-muted"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <CalendlyButton variant="primary" className="mt-2 w-full">
              Book a Call
            </CalendlyButton>
          </nav>
        </div>
      )}
    </header>
  );
}
