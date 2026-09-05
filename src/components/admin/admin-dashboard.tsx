"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { slugify } from "@/lib/slug";
import { resolvePostImage } from "@/lib/blog-image";
import type { PostMeta } from "@/lib/blog";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function AdminDashboard({ posts }: { posts: PostMeta[] }) {
  const router = useRouter();

  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [loadingEditSlug, setLoadingEditSlug] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [date, setDate] = useState(todayIso());
  const [author, setAuthor] = useState("Omo Tola");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");

  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const resetFields = () => {
    setMode("create");
    setEditingSlug(null);
    setTitle("");
    setSlug("");
    setSlugTouched(false);
    setExcerpt("");
    setDate(todayIso());
    setAuthor("Omo Tola");
    setTags("");
    setContent("");
    setExistingImage(null);
    setRemoveExistingImage(false);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setStatus("error");
      setMessage("Please choose a JPG, PNG, WEBP, or GIF image.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setStatus("error");
      setMessage("That image is too large — please choose one under 3MB.");
      return;
    }

    setImageFile(file);
    setRemoveExistingImage(false);
    setImagePreview(URL.createObjectURL(file));
    setStatus("idle");
    setMessage(null);
  };

  const handleEditClick = async (postSlug: string) => {
    setLoadingEditSlug(postSlug);
    setStatus("idle");
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/posts/${postSlug}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Could not load that post.");
        return;
      }

      setMode("edit");
      setEditingSlug(postSlug);
      setTitle(data.title ?? "");
      setSlug(postSlug);
      setSlugTouched(true);
      setExcerpt(data.excerpt ?? "");
      setDate(data.date ?? todayIso());
      setAuthor(data.author ?? "Omo Tola");
      setTags(Array.isArray(data.tags) ? data.tags.join(", ") : "");
      setContent(data.content ?? "");
      setExistingImage(data.image ?? null);
      setRemoveExistingImage(false);
      setImageFile(null);
      setImagePreview(null);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("error");
      setMessage("Network error loading that post.");
    } finally {
      setLoadingEditSlug(null);
    }
  };

  const handleCancelEdit = () => {
    resetFields();
    setStatus("idle");
    setMessage(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);

    try {
      let imagePath: string | undefined;

      if (imageFile) {
        const dataUrl = await readFileAsDataUrl(imageFile);
        const uploadRes = await fetch("/api/admin/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, mimeType: imageFile.type, contentBase64: dataUrl }),
        });
        const uploadData = await uploadRes.json().catch(() => ({}));
        if (!uploadRes.ok) {
          setStatus("error");
          setMessage(uploadData.error ?? "Image upload failed.");
          return;
        }
        imagePath = uploadData.path;
      } else if (mode === "edit" && existingImage && !removeExistingImage) {
        imagePath = existingImage;
      }

      const res = await fetch(mode === "edit" ? `/api/admin/posts/${editingSlug}` : "/api/admin/posts", {
        method: mode === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, excerpt, date, author, tags, content, image: imagePath }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }

      const wasEdit = mode === "edit";
      resetFields();
      setStatus("success");
      setMessage(
        wasEdit
          ? `Updated! Pushed to GitHub — Vercel is now deploying. Changes to /blog/${data.slug} will be live in a minute or two.`
          : `Published! Pushed to GitHub — Vercel is now deploying. It'll appear at /blog/${data.slug} in a minute or two.`,
      );
      router.refresh();
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

  const showExistingImage = mode === "edit" && !!existingImage && !removeExistingImage && !imageFile;
  const previewSrc = imagePreview
    ? imagePreview
    : showExistingImage
      ? existingImage
      : slug
        ? resolvePostImage(slug, null, 800, 420)
        : null;

  return (
    <section className="py-16 lg:py-20">
      <div className="container-page max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            {mode === "edit" && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="mb-2 text-sm font-medium text-brand hover:underline"
              >
                ← New Post
              </button>
            )}
            <h1 className="text-2xl font-bold text-ink">
              {mode === "edit" ? "Edit Blog Post" : "New Blog Post"}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {mode === "edit"
                ? "Updating commits the change directly to the live site's repo — Vercel deploys it automatically."
                : "Publishing commits the post directly to the live site's repo — Vercel deploys it automatically."}
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
            Log Out
          </Button>
        </div>

        <Card className="mt-8 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "edit" && (
              <div className="flex items-center justify-between rounded-lg bg-surface-muted px-4 py-2.5 text-sm text-ink">
                <span>
                  Editing <span className="font-medium">/blog/{editingSlug}</span>
                </span>
                <Button type="button" variant="ghost" size="sm" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            )}

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
                {mode === "edit" && (
                  <span className="font-normal text-muted"> — locked while editing</span>
                )}
              </label>
              <Input
                id="post-slug"
                value={slug}
                disabled={mode === "edit"}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                required
              />
            </div>

            <div>
              <label htmlFor="post-image" className="mb-1.5 block text-sm font-medium text-ink">
                Featured Image
              </label>

              {previewSrc && (
                <div className="relative h-40 w-full overflow-hidden rounded-xl bg-surface-muted">
                  {imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element -- local blob preview, not a site asset
                    <img src={imagePreview} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Image src={previewSrc} alt="" fill sizes="700px" className="object-cover" />
                  )}
                </div>
              )}

              <input
                id="post-image"
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                onChange={handleImageChange}
                className="mt-2 block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand hover:file:bg-brand-100"
              />

              {showExistingImage && (
                <label className="mt-2 flex items-center gap-2 text-xs text-muted">
                  <input
                    type="checkbox"
                    checked={removeExistingImage}
                    onChange={(e) => setRemoveExistingImage(e.target.checked)}
                  />
                  Remove this image and use an automatic stock photo instead
                </label>
              )}

              <p className="mt-1.5 text-xs text-muted">
                {imageFile || showExistingImage
                  ? "This uploaded photo will be used for this post."
                  : "No image uploaded — a free stock photo will be picked automatically based on the slug."}{" "}
                JPG, PNG, WEBP, or GIF, up to 3MB.
              </p>
            </div>

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
              {status === "loading"
                ? mode === "edit"
                  ? "Updating..."
                  : "Publishing..."
                : mode === "edit"
                  ? "Update Post"
                  : "Publish Post"}
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
                    src={resolvePostImage(post.slug, post.image, 128, 96)}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{post.title}</p>
                  <p className="text-xs text-muted">
                    /blog/{post.slug} — {post.date}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditClick(post.slug)}
                  disabled={loadingEditSlug === post.slug}
                >
                  {loadingEditSlug === post.slug ? "Loading..." : "Edit"}
                </Button>
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
