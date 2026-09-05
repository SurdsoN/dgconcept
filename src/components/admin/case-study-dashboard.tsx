"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/slug";
import { readFileAsDataUrl } from "@/lib/read-file-as-data-url";
import { AdminTabs } from "@/components/admin/admin-tabs";
import type { CaseStudy } from "@/lib/case-studies";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

export function CaseStudyDashboard({
  caseStudies,
  categories,
  pendingReviewCount = 0,
}: {
  caseStudies: CaseStudy[];
  categories: string[];
  pendingReviewCount?: number;
}) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only clean up on unmount
  }, []);

  const resetFields = () => {
    setName("");
    setSlug("");
    setSlugTouched(false);
    setCategory("");
    setDescription("");
    setLiveUrl("");
    previews.forEach((url) => URL.revokeObjectURL(url));
    setImages([]);
    setPreviews([]);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    for (const file of files) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setStatus("error");
        setMessage("Please choose only JPG, PNG, WEBP, or GIF images.");
        return;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setStatus("error");
        setMessage("Each image must be under 3MB.");
        return;
      }
    }

    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
    setStatus("idle");
    setMessage(null);
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      setStatus("error");
      setMessage("Attach at least one image.");
      return;
    }

    setStatus("loading");
    setMessage(null);

    try {
      const uploadedPaths: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const dataUrl = await readFileAsDataUrl(images[i]);
        const uploadRes = await fetch("/api/admin/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            folder: "case-studies",
            slug,
            index: i,
            mimeType: images[i].type,
            contentBase64: dataUrl,
          }),
        });
        const uploadData = await uploadRes.json().catch(() => ({}));
        if (!uploadRes.ok) {
          setStatus("error");
          setMessage(uploadData.error ?? `Image ${i + 1} failed to upload.`);
          return;
        }
        uploadedPaths.push(uploadData.path);
      }

      const res = await fetch("/api/admin/case-studies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          category,
          description,
          liveUrl,
          images: uploadedPaths,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }

      resetFields();
      setStatus("success");
      setMessage(
        `Published! Pushed to GitHub — Vercel is now deploying. It'll appear on /case-studies in a minute or two.`,
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

  return (
    <section className="py-16 lg:py-20">
      <div className="container-page max-w-3xl">
        <AdminTabs active="portfolio" pendingReviewCount={pendingReviewCount} />

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink">New Case Study</h1>
            <p className="mt-1 text-sm text-muted">
              Publishing commits the case study directly to the live site&apos;s
              repo — Vercel deploys it automatically.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
            Log Out
          </Button>
        </div>

        <Card className="mt-8 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="cs-name" className="mb-1.5 block text-sm font-medium text-ink">
                Project Name
              </label>
              <Input
                id="cs-name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="cs-slug" className="mb-1.5 block text-sm font-medium text-ink">
                URL Slug
              </label>
              <Input
                id="cs-slug"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                required
              />
            </div>
            <div>
              <label htmlFor="cs-category" className="mb-1.5 block text-sm font-medium text-ink">
                Category
              </label>
              <Input
                id="cs-category"
                list="cs-category-options"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Business Website, Shopify Store, E-commerce..."
                required
              />
              <datalist id="cs-category-options">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
            <div>
              <label htmlFor="cs-description" className="mb-1.5 block text-sm font-medium text-ink">
                Excerpt
              </label>
              <Textarea
                id="cs-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="What the project was, and a real result if you have one."
                required
              />
            </div>
            <div>
              <label htmlFor="cs-live-url" className="mb-1.5 block text-sm font-medium text-ink">
                Live Preview URL <span className="font-normal text-muted">(optional)</span>
              </label>
              <Input
                id="cs-live-url"
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://client-site.com"
              />
              <p className="mt-1.5 text-xs text-muted">
                If set, the case study card links here. Otherwise the card
                isn&apos;t clickable.
              </p>
            </div>

            <div>
              <label htmlFor="cs-images" className="mb-1.5 block text-sm font-medium text-ink">
                Images
              </label>
              {previews.length > 0 && (
                <div className="mb-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {previews.map((preview, i) => (
                    <div key={preview} className="group relative h-20 overflow-hidden rounded-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview, not a site asset */}
                      <img src={preview} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        aria-label="Remove image"
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5 text-center text-[10px] font-medium text-white">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <input
                id="cs-images"
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                multiple
                onChange={handleImagesChange}
                className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand hover:file:bg-brand-100"
              />
              <p className="mt-1.5 text-xs text-muted">
                The first image becomes the card thumbnail. JPG, PNG, WEBP, or
                GIF, up to 3MB each.
              </p>
            </div>

            {message && (
              <p className={`text-sm ${status === "success" ? "text-emerald-600" : "text-brand"}`}>
                {message}
              </p>
            )}

            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Publishing..." : "Publish Case Study"}
            </Button>
          </form>
        </Card>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-ink">Published Case Studies</h2>
          <p className="mt-1 text-xs text-muted">
            Reflects the last deploy — a case study you just published appears
            here once Vercel finishes building.
          </p>
          <div className="mt-4 space-y-2">
            {caseStudies.map((project) => (
              <Card key={project.slug} className="flex items-center gap-3 p-4">
                <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={project.images[0]}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{project.name}</p>
                  <p className="text-xs text-muted">{project.category}</p>
                </div>
              </Card>
            ))}
            {caseStudies.length === 0 && (
              <p className="text-sm text-muted">No case studies published yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
