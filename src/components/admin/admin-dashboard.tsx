"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { slugify } from "@/lib/slug";
import { getPostImageUrl } from "@/lib/blog-image";
import type { PostMeta } from "@/lib/blog";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function AdminDashboard({ posts }: { posts: PostMeta[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [date, setDate] = useState(todayIso());
  const [author, setAuthor] = useState("Omo Tola");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, excerpt, date, author, tags, content }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }
      setStatus("success");
      setMessage(
        `Published! Pushed to GitHub — Vercel is now deploying. It'll appear at /blog/${data.slug} in a minute or two.`,
      );
      setTitle("");
      setSlug("");
      setSlugTouched(false);
      setExcerpt("");
      setTags("");
      setContent("");
      setDate(todayIso());
    } catch {
      setStatus("error");
      setMessage("Network error — please try again.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  const tagList = tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <section className="py-16 lg:py-20">
      <div className="container-page max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink">New Blog Post</h1>
            <p className="mt-1 text-sm text-muted">
              Publishing commits the post directly to the live site&apos;s repo —
              Vercel deploys it automatically.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
            Log Out
          </Button>
        </div>

        <Card className="mt-8 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="post-title" className="mb-1.5 block text-sm font-medium text-ink">
                Title
              </label>
              <Input
                id="post-title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="post-slug" className="mb-1.5 block text-sm font-medium text-ink">
                URL Slug <span className="font-normal text-muted">(/blog/...)</span>
              </label>
              <Input
                id="post-slug"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                required
              />
            </div>

            {slug && (
              <div>
                <p className="mb-1.5 text-sm font-medium text-ink">Featured Image</p>
                <div className="relative h-40 w-full overflow-hidden rounded-xl">
                  <Image
                    src={getPostImageUrl(slug, 800, 420)}
                    alt=""
                    fill
                    sizes="700px"
                    className="object-cover"
                  />
                </div>
                <p className="mt-1.5 text-xs text-muted">
                  Automatically picked from free stock photography based on the
                  slug above — every post gets a consistent photo with nothing
                  to upload. Changing the slug changes the photo.
                </p>
              </div>
            )}

            <div>
              <label htmlFor="post-excerpt" className="mb-1.5 block text-sm font-medium text-ink">
                Excerpt
              </label>
              <Textarea
                id="post-excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="post-date" className="mb-1.5 block text-sm font-medium text-ink">
                  Date
                </label>
                <Input
                  id="post-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="post-author" className="mb-1.5 block text-sm font-medium text-ink">
                  Author
                </label>
                <Input id="post-author" value={author} onChange={(e) => setAuthor(e.target.value)} />
              </div>
            </div>
            <div>
              <label htmlFor="post-tags" className="mb-1.5 block text-sm font-medium text-ink">
                Tags <span className="font-normal text-muted">(comma-separated, optional)</span>
              </label>
              <Input
                id="post-tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="shopify, seo, conversion"
              />
              <p className="mt-1.5 text-xs text-muted">
                The first tag becomes the post&apos;s category badge; all of
                them show as pills under the article and decide which posts
                appear under &quot;Related Articles&quot;.
              </p>
              {tagList.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="brand">{tagList[0]}</Badge>
                  {tagList.slice(1).map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="post-content" className="mb-1.5 block text-sm font-medium text-ink">
                Content <span className="font-normal text-muted">(Markdown)</span>
              </label>
              <Textarea
                id="post-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={16}
                className="font-mono text-sm"
                placeholder={"Write the post in Markdown...\n\n## A heading\n\nA paragraph."}
                required
              />
              <p className="mt-1.5 text-xs text-muted">
                Every <code>##</code> and <code>###</code> heading here
                automatically becomes an entry in the post&apos;s &quot;On This
                Page&quot; jump-to-section menu.
              </p>
            </div>

            {message && (
              <p className={`text-sm ${status === "success" ? "text-emerald-600" : "text-brand"}`}>
                {message}
              </p>
            )}

            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Publishing..." : "Publish Post"}
            </Button>
          </form>
        </Card>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-ink">Published Posts</h2>
          <p className="mt-1 text-xs text-muted">
            Reflects the last deploy — a post you just published appears here
            once Vercel finishes building.
          </p>
          <div className="mt-4 space-y-2">
            {posts.map((post) => (
              <Card key={post.slug} className="flex items-center gap-3 p-4">
                <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={getPostImageUrl(post.slug, 128, 96)}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{post.title}</p>
                  <p className="text-xs text-muted">
                    /blog/{post.slug} — {post.date}
                  </p>
                </div>
              </Card>
            ))}
            {posts.length === 0 && (
              <p className="text-sm text-muted">No posts published yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
