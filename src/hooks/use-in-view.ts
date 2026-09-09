"use client";

import { useEffect, useRef, useState } from "react";

// Fires once, the first time the element scrolls into view, then stops
// observing — a one-shot reveal trigger, not a visibility tracker.
//
// Always starts `false`, on both server and client: branching the initial
// state on `typeof IntersectionObserver` (undefined during SSR, defined in
// the browser) would render the server HTML already "revealed", and since
// nothing re-renders that element before the real observer fires, that
// stale revealed markup is what hydration keeps.
export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
