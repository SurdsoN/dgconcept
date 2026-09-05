import { slugify } from "@/lib/slug";

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
};

function textContent(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  if (!node.children) return "";
  return node.children.map(textContent).join("");
}

function assignIds(node: HastNode, seen: Map<string, number>) {
  if (node.tagName === "h2" || node.tagName === "h3") {
    const text = textContent(node).trim();
    let id = slugify(text) || "section";
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count}`;
    node.properties = { ...(node.properties ?? {}), id };
  }
  node.children?.forEach((child) => assignIds(child, seen));
}

// Assigns ids to h2/h3 elements so the "On This Page" TOC (built from the
// raw markdown via extractToc in toc.ts) can link to them with #anchors.
export function rehypeHeadingIds() {
  return (tree: HastNode) => {
    assignIds(tree, new Map());
  };
}
