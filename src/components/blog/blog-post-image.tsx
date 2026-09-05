import Image from "next/image";
import { getPostImageUrl } from "@/lib/blog-image";

export function BlogPostImage({ slug, title }: { slug: string; title: string }) {
  return (
    <div className="relative h-48 overflow-hidden rounded-2xl sm:h-64">
      <Image
        src={getPostImageUrl(slug, 1200, 630)}
        alt={title}
        fill
        sizes="(min-width: 1024px) 800px, 100vw"
        className="object-cover"
        priority
      />
    </div>
  );
}
