import Link from "next/link";
import type { Metadata } from "next";
import { CalendarDays, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog & Resources",
  description: "Practical advice on websites, Shopify stores, and conversion.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <section className="py-16 lg:py-20">
      <div className="container-page">
        <Badge variant="brand" className="mb-4">
          Blog &amp; Resources
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Ideas to Help Your Website Sell
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted">
          Practical, no-fluff notes on websites, Shopify, and conversion —
          written from real project work.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="h-full p-6 transition-shadow hover:shadow-md">
                <h2 className="text-lg font-semibold text-ink">{post.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {post.excerpt}
                </p>
                <div className="mt-5 flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readingTime}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="mt-10 text-sm text-muted">
            No posts yet — add .mdx files to src/content/blog to get started.
          </p>
        )}
      </div>
    </section>
  );
}
