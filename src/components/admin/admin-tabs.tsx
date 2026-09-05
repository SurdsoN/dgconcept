import Link from "next/link";

type AdminTab = "blog" | "portfolio" | "reviews";

export function AdminTabs({
  active,
  pendingReviewCount = 0,
}: {
  active: AdminTab;
  pendingReviewCount?: number;
}) {
  const tabClass = (tab: AdminTab) =>
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
      <Link href="/admin?tab=reviews" className={tabClass("reviews")}>
        Reviews
        {pendingReviewCount > 0 && (
          <span className="ml-1.5 rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {pendingReviewCount}
          </span>
        )}
      </Link>
    </div>
  );
}
