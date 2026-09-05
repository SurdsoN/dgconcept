import fs from "fs";
import path from "path";

const REVIEWS_DIR = path.join(process.cwd(), "src/content/reviews");

export type ReviewStatus = "pending" | "approved";

export type Review = {
  slug: string;
  name: string;
  company: string | null;
  rating: number;
  quote: string;
  date: string;
  status: ReviewStatus;
};

function parseReview(slug: string, raw: string): Review {
  const data = JSON.parse(raw) as Record<string, unknown>;
  const rating = Number(data.rating);
  return {
    slug,
    name: (data.name as string) ?? "Anonymous",
    company: typeof data.company === "string" && data.company.trim() ? data.company : null,
    rating: Number.isFinite(rating) ? Math.min(5, Math.max(1, Math.round(rating))) : 5,
    quote: (data.quote as string) ?? "",
    date: (data.date as string) ?? "2026-01-01",
    status: data.status === "approved" ? "approved" : "pending",
  };
}

export function getAllReviews(): Review[] {
  if (!fs.existsSync(REVIEWS_DIR)) return [];

  const files = fs.readdirSync(REVIEWS_DIR).filter((f) => f.endsWith(".json"));
  const items = files.map((filename) => {
    const slug = filename.replace(/\.json$/, "");
    const raw = fs.readFileSync(path.join(REVIEWS_DIR, filename), "utf-8");
    return parseReview(slug, raw);
  });

  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getApprovedReviews(): Review[] {
  return getAllReviews().filter((r) => r.status === "approved");
}

export function getPendingReviews(): Review[] {
  return getAllReviews().filter((r) => r.status === "pending");
}
