import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getAllPosts } from "@/lib/blog";

const STATIC_PAGES: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/about", priority: 0.7 },
  { path: "/pricing", priority: 0.8 },
  { path: "/case-studies", priority: 0.8 },
  { path: "/roi-calculator", priority: 0.6 },
  { path: "/blog", priority: 0.7 },
  { path: "/contact", priority: 0.6 },
  { path: "/audit", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_PAGES.map(({ path, priority }) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    priority,
  }));

  const postEntries = getAllPosts().map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries];
}
