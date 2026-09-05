"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Link2 } from "lucide-react";
import {
  XIcon,
  FacebookIcon,
  LinkedInIcon,
  WhatsAppIcon,
} from "@/components/icons/social-icons";

const iconButtonClass =
  "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-brand hover:text-brand";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const url = useSyncExternalStore(
    () => () => {},
    () => window.location.href,
    () => "",
  );

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: XIcon,
    },
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: FacebookIcon,
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: LinkedInIcon,
    },
    {
      label: "Share on WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: WhatsAppIcon,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — the visible URL/share links still work.
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-medium uppercase tracking-wide text-muted">
        Share
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className={iconButtonClass}
          >
            <link.icon className="h-4 w-4" />
          </a>
        ))}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy link"
          className={iconButtonClass}
        >
          {copied ? (
            <Check className="h-4 w-4 text-brand" />
          ) : (
            <Link2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
