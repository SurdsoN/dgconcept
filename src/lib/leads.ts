import fs from "fs";
import path from "path";

const LEADS_DIR = path.join(process.cwd(), "src/content/leads");

export type Lead = {
  id: string;
  name: string;
  email: string;
  source: string;
  date: string;
};

function parseLead(id: string, raw: string): Lead {
  const data = JSON.parse(raw) as Record<string, unknown>;
  return {
    id,
    name: (data.name as string) ?? "",
    email: (data.email as string) ?? "",
    source: (data.source as string) ?? "unknown",
    date: (data.date as string) ?? "2026-01-01",
  };
}

export function getAllLeads(): Lead[] {
  if (!fs.existsSync(LEADS_DIR)) return [];

  const files = fs.readdirSync(LEADS_DIR).filter((f) => f.endsWith(".json"));
  const items = files.map((filename) => {
    const id = filename.replace(/\.json$/, "");
    const raw = fs.readFileSync(path.join(LEADS_DIR, filename), "utf-8");
    return parseLead(id, raw);
  });

  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}
