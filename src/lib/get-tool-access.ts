import fs from "fs";
import path from "path";
import { TOOLS, DEFAULT_TOOL_ACCESS, type ToolAccess } from "@/lib/tool-access";

const FILE_PATH = path.join(process.cwd(), "src/content/settings/tool-access.json");

// Server-only (uses fs) — kept out of tool-access.ts so that file can be
// imported from client components without pulling fs into their bundle.
export function getToolAccess(): ToolAccess {
  if (!fs.existsSync(FILE_PATH)) return DEFAULT_TOOL_ACCESS;

  try {
    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    const data = JSON.parse(raw) as Record<string, unknown>;
    const result = { ...DEFAULT_TOOL_ACCESS };
    for (const tool of TOOLS) {
      const value = data[tool.id];
      if (Array.isArray(value)) {
        result[tool.id] = value.filter((code): code is string => typeof code === "string");
      }
    }
    return result;
  } catch {
    return DEFAULT_TOOL_ACCESS;
  }
}
