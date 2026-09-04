"use client";

import { useSyncExternalStore } from "react";
import { PopupButton } from "react-calendly";
import { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

interface CalendlyButtonProps extends VariantProps<typeof buttonVariants> {
  children: string;
  className?: string;
}

export function CalendlyButton({
  children,
  className,
  variant,
  size,
}: CalendlyButtonProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const classes = cn(buttonVariants({ variant, size, className }));

  if (!mounted) {
    return (
      <button type="button" disabled className={classes}>
        {children}
      </button>
    );
  }

  return (
    <PopupButton
      url={siteConfig.calendlyUrl}
      rootElement={document.body}
      text={children}
      className={classes}
    />
  );
}
