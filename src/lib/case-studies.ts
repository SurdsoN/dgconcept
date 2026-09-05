import fs from "fs";
import path from "path";

const CASE_STUDIES_DIR = path.join(process.cwd(), "src/content/case-studies");

export type CaseStudy = {
  slug: string;
  name: string;
  category: string;
  description: string;
  images: string[];
  date: string;
  liveUrl: string | null;
  flickrUrl: string | null;
};

function parseCaseStudy(slug: string, raw: string): CaseStudy {
  const data = JSON.parse(raw) as Record<string, unknown>;
  return {
    slug,
    name: (data.name as string) ?? slug,
    category: (data.category as string) ?? "Website",
    description: (data.description as string) ?? "",
    images: Array.isArray(data.images)
      ? data.images.filter((img): img is string => typeof img === "string")
      : [],
    date: (data.date as string) ?? "2026-01-01",
    liveUrl: typeof data.liveUrl === "string" && data.liveUrl.trim() ? data.liveUrl : null,
    flickrUrl: typeof data.flickrUrl === "string" && data.flickrUrl.trim() ? data.flickrUrl : null,
  };
}

export function getAllCaseStudies(): CaseStudy[] {
  if (!fs.existsSync(CASE_STUDIES_DIR)) return [];

  const files = fs.readdirSync(CASE_STUDIES_DIR).filter((f) => f.endsWith(".json"));
  const items = files.map((filename) => {
    const slug = filename.replace(/\.json$/, "");
    const raw = fs.readFileSync(path.join(CASE_STUDIES_DIR, filename), "utf-8");
    return parseCaseStudy(slug, raw);
  });

  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getCaseStudyCategories(caseStudies: CaseStudy[]): string[] {
  return Array.from(new Set(caseStudies.map((c) => c.category)));
}
