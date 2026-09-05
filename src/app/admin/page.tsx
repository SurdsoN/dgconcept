import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, isSessionTokenValid } from "@/lib/admin-auth";
import { getAllPosts } from "@/lib/blog";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const authenticated = isSessionTokenValid(cookieStore.get(ADMIN_COOKIE_NAME)?.value);

  if (!authenticated) {
    return <AdminLogin />;
  }

  return <AdminDashboard posts={getAllPosts()} />;
}
