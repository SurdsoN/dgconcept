import Link from "next/link";

export function AdminTabs({ active }: { active: "blog" | "portfolio" }) {
  const tabClass = (tab: "blog" | "portfolio") =>
    `border-b-2 pb-3 text-sm font-medium transition-colors ${
      active === tab
        ? "border-brand text-brand"
        : "border-transparent text-muted hover:text-ink"
    }`;

  return (
    <div className="mb-6 flex gap-6 border-b border-border">
      <Link href="/admin" className={tabClass("blog")}>
        Blog Posts
      </Link>
      <Link href="/admin?tab=portfolio" className={tabClass("portfolio")}>
        Case Studies
      </Link>
    </div>
  );
}
