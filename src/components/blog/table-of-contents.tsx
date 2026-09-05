import type { TocItem } from "@/lib/toc";

export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 lg:sticky lg:top-24">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">On This Page</p>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id} className={item.depth === 3 ? "pl-3" : undefined}>
            <a href={`#${item.id}`} className="text-muted hover:text-brand">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
