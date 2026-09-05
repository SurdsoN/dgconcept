import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, Clock, ChevronRight } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostSource, getRelatedPosts } from "@/lib/blog";
import { extractToc } from "@/lib/toc";
import { rehypeHeadingIds } from "@/lib/mdx-heading-ids";
import { Badge } from "@/components/ui/badge";
import { ShareButtons } from "@/components/share-buttons";
import { BlogPostImage } from "@/components/blog/blog-post-image";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { AuthorBio } from "@/components/blog/author-bio";
import { RelatedPosts } from "@/components/blog/related-posts";
import { CtaBanner } from "@/components/sections/cta-banner";

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

  const toc = extractToc(post.content);
  const related = getRelatedPosts(post.meta);

  return (
    <>
      <article className="py-16 lg:py-20">
        <div className="container-page max-w-5xl">
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
            <Link href="/" className="hover:text-brand">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/blog" className="hover:text-brand">
              Blog
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="truncate text-ink">{post.meta.title}</span>
          </nav>

          {post.meta.tags[0] && (
            <Badge variant="brand" className="mt-4">
              {post.meta.tags[0]}
            </Badge>
          )}

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {post.meta.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted">{post.meta.excerpt}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted">
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

          <div className="mt-8">
            <BlogPostImage slug={slug} title={post.meta.title} />
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_260px]">
            <div className="min-w-0">
              <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-headings:text-ink prose-p:text-muted prose-li:text-muted prose-a:text-brand prose-strong:text-ink">
                <MDXRemote
                  source={post.content}
                  options={{ mdxOptions: { rehypePlugins: [rehypeHeadingIds] } }}
                />
              </div>

              {post.meta.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {post.meta.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="mt-8 border-t border-border pt-6">
                <ShareButtons title={post.meta.title} />
              </div>

              <div className="mt-8">
                <AuthorBio />
              </div>
            </div>

            <aside className="order-first lg:order-last">
              <TableOfContents items={toc} />
            </aside>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <RelatedPosts posts={related} />
            </div>
          )}
        </div>
      </article>

      <CtaBanner
        title="Need Help Applying This to Your Website?"
        description="Work directly with Omo Tola to bring your website or Shopify store up to speed."
        primaryLabel="Start a Project"
        primaryHref="/contact"
        secondaryLabel="View Pricing"
        secondaryHref="/pricing"
        showCalendly={false}
      />
    </>
  );
}
