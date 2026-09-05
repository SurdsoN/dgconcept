import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export type PostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  readingTime: string;
};

function toTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0);
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
    const { data, content } = matter(raw);

    return {
      slug,
      title: data.title as string,
      excerpt: data.excerpt as string,
      date: data.date as string,
      author: (data.author as string) ?? "DgConcept",
      tags: toTags(data.tags),
      readingTime: readingTime(content).text,
    };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostSource(slug: string) {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    content,
    meta: {
      slug,
      title: data.title as string,
      excerpt: data.excerpt as string,
      date: data.date as string,
      author: (data.author as string) ?? "DgConcept",
      tags: toTags(data.tags),
      readingTime: readingTime(content).text,
    } satisfies PostMeta,
  };
}

// Posts sharing the most tags with `current` come first; ties broken by
// most recent. Falls back to "just the latest other posts" when there are
// no tags at all.
export function getRelatedPosts(current: PostMeta, limit = 3): PostMeta[] {
  const currentTags = new Set(current.tags);

  return getAllPosts()
    .filter((post) => post.slug !== current.slug)
    .map((post) => ({
      post,
      sharedTags: post.tags.filter((tag) => currentTags.has(tag)).length,
    }))
    .sort((a, b) => b.sharedTags - a.sharedTags || (a.post.date < b.post.date ? 1 : -1))
    .slice(0, limit)
    .map(({ post }) => post);
}
