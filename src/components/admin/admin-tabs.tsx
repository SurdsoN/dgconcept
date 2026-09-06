import Link from "next/link";

type AdminTab = "blog" | "portfolio" | "reviews" | "leads" | "access";

export function AdminTabs({
  active,
  pendingReviewCount = 0,
}: {
  active: AdminTab;
  pendingReviewCount?: number;
}) {
  const tabClass = (tab: AdminTab) =>
    `shrink-0 border-b-2 pb-3 text-sm font-medium transition-colors ${
      active === tab
        ? "border-brand text-brand"
        : "border-transparent text-muted hover:text-ink"
    }`;

  return (
    <div className="mb-6 overflow-x-auto border-b border-border">
      <div className="flex w-max min-w-full gap-6">
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
        <Link href="/admin?tab=leads" className={tabClass("leads")}>
          Leads
        </Link>
        <Link href="/admin?tab=access" className={tabClass("access")}>
          Access
        </Link>
      </div>
    </div>
  );
}
