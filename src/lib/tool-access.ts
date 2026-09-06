export type ToolId = "audit" | "roi-calculator" | "free-guide";

export const TOOLS: { id: ToolId; label: string; path: string }[] = [
  { id: "audit", label: "Free Website Audit", path: "/audit" },
  { id: "roi-calculator", label: "ROI Calculator", path: "/roi-calculator" },
  { id: "free-guide", label: "Free Dropshipping Guide", path: "/free-guide" },
];

export type ToolAccess = Record<ToolId, string[]>;

// Preserves the behavior already live before this became admin-editable —
// the free guide was blocked in India, Pakistan, and Nigeria.
export const DEFAULT_TOOL_ACCESS: ToolAccess = {
  audit: [],
  "roi-calculator": [],
  "free-guide": ["IN", "PK", "NG"],
};
