import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PostMeta } from "@/lib/blog";

export function RelatedPosts({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-ink">Related Articles</h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="h-full p-5 transition-shadow hover:shadow-md">
              {post.tags[0] && (
                <Badge variant="brand" className="mb-2">
                  {post.tags[0]}
                </Badge>
              )}
              <p className="text-sm font-semibold leading-snug text-ink">{post.title}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
