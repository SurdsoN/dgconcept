import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, isSessionTokenValid } from "@/lib/admin-auth";
import { getAllPosts } from "@/lib/blog";
import { getAllCaseStudies, getCaseStudyCategories } from "@/lib/case-studies";
import { getApprovedReviews, getPendingReviews } from "@/lib/reviews";
import { getAllLeads } from "@/lib/leads";
import { getToolAccess } from "@/lib/get-tool-access";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { CaseStudyDashboard } from "@/components/admin/case-study-dashboard";
import { ReviewDashboard } from "@/components/admin/review-dashboard";
import { LeadDashboard } from "@/components/admin/lead-dashboard";
import { ToolAccessDashboard } from "@/components/admin/tool-access-dashboard";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const cookieStore = await cookies();
  const authenticated = isSessionTokenValid(cookieStore.get(ADMIN_COOKIE_NAME)?.value);

  if (!authenticated) {
    return <AdminLogin />;
  }

  const { tab } = await searchParams;
  const pendingReviews = getPendingReviews();

  if (tab === "access") {
    return <ToolAccessDashboard toolAccess={getToolAccess()} />;
  }

  if (tab === "leads") {
    return <LeadDashboard leads={getAllLeads()} />;
  }

  if (tab === "reviews") {
    return <ReviewDashboard reviews={pendingReviews} approvedReviews={getApprovedReviews()} />;
  }

  if (tab === "portfolio") {
    const caseStudies = getAllCaseStudies();
    return (
      <CaseStudyDashboard
        caseStudies={caseStudies}
        categories={getCaseStudyCategories(caseStudies)}
        pendingReviewCount={pendingReviews.length}
      />
    );
  }

  return <AdminDashboard posts={getAllPosts()} pendingReviewCount={pendingReviews.length} />;
}
