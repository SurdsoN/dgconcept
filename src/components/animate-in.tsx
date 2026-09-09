"use client";

import type { ReactNode, CSSProperties } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

// Fades + slides an element up into place the first time it scrolls into
// view. `delay` (ms) staggers items in a grid/list. No-ops visually for
// prefers-reduced-motion via the motion-reduce: variant.
export function AnimateIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className,
      )}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" } as CSSProperties}
    >
      {children}
    </div>
  );
}
