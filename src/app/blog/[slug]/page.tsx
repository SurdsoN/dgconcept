import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, Clock } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostSource } from "@/lib/blog";
import { ShareButtons } from "@/components/share-buttons";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostSource(slug);
  if (!post) return {};
  return { title: post.meta.title, description: post.meta.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostSource(slug);
  if (!post) notFound();

  return (
    <article className="py-16 lg:py-20">
      <div className="container-page max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {post.meta.title}
        </h1>
        <div className="mt-4 flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {new Date(post.meta.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {post.meta.readingTime}
          </span>
          <span>By {post.meta.author}</span>
        </div>

        <div className="prose prose-neutral mt-10 max-w-none prose-headings:font-bold prose-headings:text-ink prose-p:text-muted prose-li:text-muted prose-a:text-brand prose-strong:text-ink">
          <MDXRemote source={post.content} />
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <ShareButtons title={post.meta.title} />
        </div>
      </div>
    </article>
  );
}
